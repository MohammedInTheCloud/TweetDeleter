class TextAnalyzer {
    parseImprovements(originalText, xmlImprovements) {
        const improvements = [];
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlImprovements, "text/xml");
        const improvementNodes = xmlDoc.getElementsByTagName("improvement");

        for (let i = 0; i < improvementNodes.length; i++) {
            const original = improvementNodes[i].getElementsByTagName("original")[0].textContent;
            const suggested = improvementNodes[i].getElementsByTagName("suggested")[0].textContent;
            const startIndex = originalText.indexOf(original);
            if (startIndex !== -1) {
                improvements.push({
                    start: startIndex,
                    end: startIndex + original.length,
                    original: original,
                    suggested: suggested
                });
            }
        }

        return improvements;
    }
}
export default TextAnalyzer;