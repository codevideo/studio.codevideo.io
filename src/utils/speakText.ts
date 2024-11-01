export const speakText = (text: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const speechSynthesis = window.speechSynthesis;
  
      // Create a new SpeechSynthesisUtterance object
      const utterance = new SpeechSynthesisUtterance(text);
  
      // Resolve the promise when speech is done
      utterance.onend = () => {
        resolve();
      };
  
      // Speak the text
      speechSynthesis.speak(utterance);
    });
  };
  