use wasm_bindgen::prelude::*;
use std::collections::HashMap;

#[wasm_bindgen]
pub struct VirtualFileSystem {
    files: HashMap<String, String>,
}

#[wasm_bindgen]
impl VirtualFileSystem {
    #[wasm_bindgen(constructor)]
    pub fn new() -> VirtualFileSystem {
        VirtualFileSystem {
            files: HashMap::new(),
        }
    }

    pub fn add_file(&mut self, path: String, content: String) {
        self.files.insert(path, content);
    }

    pub fn compile_and_run(&self) -> String {
        // In a real implementation, this would use a Rust compiler compiled to WASM
        // like a minimized version of rustc or use an interpreter
        
        // For now, we'll simulate the process with limited functionality
        
        // Check if main.rs exists
        let main_content = match self.files.get("main.rs") {
            Some(content) => content,
            None => return "Error: main.rs file not found".to_string(),
        };

        // Extremely simplified "parser" to check for some basic errors
        if !main_content.contains("fn main()") {
            return "Error: No main function found".to_string();
        }

        // Fake "compilation" check for other common errors
        for (path, content) in &self.files {
            // Check for unclosed braces (very naive)
            let open_braces = content.matches('{').count();
            let close_braces = content.matches('}').count();
            
            if open_braces != close_braces {
                return format!("Error in {}: Mismatched braces", path);
            }
            
            // Check for missing semicolons (also very naive)
            if content.contains("println!(") && !content.contains("println!(\"\");") && 
               !content.contains("println!(\"\")") && !content.contains(");") {
                return format!("Error in {}: Missing semicolon", path);
            }
        }

        // If no errors, "run" the code by extracting print statements
        // This is a very simplified simulation
        let mut output = String::new();
        
        for line in main_content.lines() {
            if line.contains("println!(") {
                // Extract the string inside the println!() - extremely naive implementation
                if let Some(start) = line.find("\"") {
                    if let Some(end) = line[start+1..].find("\"") {
                        let text = &line[start+1..start+1+end];
                        output.push_str(text);
                        output.push('\n');
                    }
                }
            }
        }
        
        if output.is_empty() {
            output = "Program executed successfully with no output".to_string();
        }
        
        output
    }
}