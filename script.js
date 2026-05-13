const startBtn = document.getElementById("startBtn");
const translatedOutput = document.getElementById("translatedOutput");

let recognition;

if ('webkitSpeechRecognition' in window) {

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

} else {
    alert("Speech Recognition not supported in this browser.");
}

startBtn.addEventListener("click", () => {

    speechOutput.innerHTML = "Listening...";
    translatedOutput.innerHTML = "Waiting for translation...";

    recognition.start();
});

stopBtn.addEventListener("click", () => {
    recognition.stop();
});

recognition.onresult = async (event) => {

    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
    }

    speechOutput.innerHTML = transcript;

    await translateText(transcript);
};

async function translateText(text) {

    const translatorKey = document.getElementById("translatorKey").value;
    const translatorRegion = document.getElementById("translatorRegion").value;
    const targetLanguage = document.getElementById("targetLanguage").value;

    if (!translatorKey || !translatorRegion) {
        translatedOutput.innerHTML = "Please enter Translator credentials.";
        return;
    }

    const endpoint = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" + targetLanguage;

    try {

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": translatorKey,
                "Ocp-Apim-Subscription-Region": translatorRegion,
                "Content-Type": "application/json"
            },
            body: JSON.stringify([
                {
                    Text: text
                }
            ])
        });

        const data = await response.json();

        translatedOutput.innerHTML = data[0].translations[0].text;

    } catch (error) {

        console.error(error);
        translatedOutput.innerHTML = "Translation failed.";
    }
}