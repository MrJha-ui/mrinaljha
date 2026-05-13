const speakBtn = document.getElementById("speakBtn");
const translatedOutput = document.getElementById("translatedOutput");

speakBtn.addEventListener("click", async () => {

    const text = document.getElementById("inputText").value;
    const speechKey = document.getElementById("speechKey").value;
    const speechRegion = document.getElementById("speechRegion").value;
    const voiceName = document.getElementById("voiceName").value;

    if (!text || !speechKey || !speechRegion) {
        alert("Please fill all required fields.");
        return;
    }

    translatedOutput.innerHTML = "Generating speech...";

    const endpoint = `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const ssml = `
    <speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' name='${voiceName}'>
            ${text}
        </voice>
    </speak>`;

    try {

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": speechKey,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3"
            },
            body: ssml
        });

        if (!response.ok) {
            throw new Error("Speech synthesis failed");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audio.play();

        translatedOutput.innerHTML = "Speech generated successfully.";

    } catch (error) {

        console.error(error);
        translatedOutput.innerHTML = "Failed to generate speech.";
    }
});
