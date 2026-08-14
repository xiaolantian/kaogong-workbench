use serde::{Deserialize, Serialize};
use std::io::BufReader;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RssSource {
    pub name: String,
    pub url: String,
    pub category: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewsItem {
    pub title: String,
    pub description: String,
    pub link: String,
    pub source_name: String,
    pub category: String,
    pub published: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FetchResult {
    pub source_name: String,
    pub items: Vec<NewsItem>,
    pub error: Option<String>,
}

#[tauri::command]
fn get_rss_sources() -> Vec<RssSource> {
    vec![
        RssSource {
            name: "少数派".to_string(),
            url: "https://sspai.com/feed".to_string(),
            category: "科技".to_string(),
        },
        RssSource {
            name: "钛媒体".to_string(),
            url: "https://www.tmtpost.com/feed".to_string(),
            category: "经济".to_string(),
        },
        RssSource {
            name: "爱范儿".to_string(),
            url: "https://www.ifanr.com/feed".to_string(),
            category: "科技".to_string(),
        },
    ]
}

#[tauri::command]
async fn fetch_rss(url: String, source_name: String) -> Result<Vec<NewsItem>, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| e.to_string())?;

    let resp = client
        .get(&url)
        .header(
            "User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        )
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let bytes = resp.bytes().await.map_err(|e| e.to_string())?;

    let channel = rss::Channel::read_from(BufReader::new(&bytes[..]))
        .map_err(|e| format!("RSS 解析失败: {}", e))?;

    let items: Vec<NewsItem> = channel
        .items()
        .iter()
        .filter_map(|item| {
            let title = item.title().map_or(String::new(), |t| t.to_string());
            if title.is_empty() {
                return None;
            }
            let description = item
                .description()
                .map_or(String::new(), |d| {
                    let d = d.trim();
                    if d.len() > 200 { d[..200].to_string() } else { d.to_string() }
                });

            Some(NewsItem {
                title,
                description,
                link: item.link().map_or(String::new(), |l| l.to_string()),
                source_name: source_name.clone(),
                category: String::new(),
                published: item.pub_date().map_or(String::new(), |d| d.to_string()),
            })
        })
        .take(30)
        .collect();

    Ok(items)
}

#[tauri::command]
fn search_news(query: String, items: Vec<NewsItem>) -> Vec<NewsItem> {
    if query.trim().is_empty() {
        return items;
    }
    let q = query.trim().to_lowercase();
    items
        .into_iter()
        .filter(|item| {
            item.title.to_lowercase().contains(&q)
                || item.description.to_lowercase().contains(&q)
        })
        .collect()
}

#[tauri::command]
async fn fetch_all_sources() -> Result<Vec<FetchResult>, String> {
    let sources = get_rss_sources();
    let mut results = Vec::new();

    for source in &sources {
        let items = fetch_rss(source.url.clone(), source.name.clone()).await;
        match items {
            Ok(mut items) => {
                for item in items.iter_mut() {
                    item.category = source.category.clone();
                }
                results.push(FetchResult {
                    source_name: source.name.clone(),
                    items,
                    error: None,
                });
            }
            Err(e) => {
                results.push(FetchResult {
                    source_name: source.name.clone(),
                    items: vec![],
                    error: Some(e),
                });
            }
        }
    }

    Ok(results)
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_rss_sources,
            fetch_rss,
            fetch_all_sources,
            search_news,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}