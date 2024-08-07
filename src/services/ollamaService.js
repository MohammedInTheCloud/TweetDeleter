// ../services/ollamaService.js

class OllamaService {
    async query(model, prompt, options = {}) {
      return new Promise((resolve, reject) => {
        window.postMessage({
          type: "OLLAMA_QUERY",
          data: {
            model: model,
            prompt: prompt,
            ...options
          }
        }, "*");
  
        const messageListener = (event) => {
          if (event.source !== window) return;
          if (event.data.type === "OLLAMA_RESPONSE") {
            window.removeEventListener("message", messageListener);
            if (event.data.success) {
              resolve(event.data.data.response.trim());
            } else {
              reject(new Error(event.data.error));
            }
          }
        };
  
        window.addEventListener("message", messageListener);
      });
    }
  }
  
  export default OllamaService;