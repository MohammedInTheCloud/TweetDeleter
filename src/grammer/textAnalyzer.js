// src/grammer/textAnalyzer.js
class TextAnalyzer {
    parseImprovements(originalText, xmlImprovements) {
        console.log('Parsing improvements. Original text:', originalText);
        console.log('XML improvements:', xmlImprovements);

        const improvements = [];
        // Remove any leading/trailing whitespace and wrap the XML in a root element
        const wrappedXml = `<root>${xmlImprovements.trim()}</root>`;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(wrappedXml, "text/xml");

        // Check for parsing errors
        const parseError = xmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
            console.error('XML parsing error:', parseError[0].textContent);
            return improvements;
        }

        const improvementNodes = xmlDoc.getElementsByTagName("improvement");
        console.log('Number of improvement nodes:', improvementNodes.length);

        let currentIndex = 0;
        for (let i = 0; i < improvementNodes.length; i++) {
            const original = improvementNodes[i].getElementsByTagName("original")[0]?.textContent;
            const suggested = improvementNodes[i].getElementsByTagName("suggested")[0]?.textContent;

            if (original && suggested) {
                console.log(`Processing improvement ${i + 1}:`, { original, suggested });
                const matchIndex = this.fuzzyFind(originalText, original, currentIndex);

                if (matchIndex !== -1) {
                    improvements.push({
                        start: matchIndex,
                        end: matchIndex + original.length,
                        original: original,
                        suggested: suggested
                    });

                    currentIndex = matchIndex + original.length;
                    console.log(`Match found at index ${matchIndex}`);
                } else {
                    console.warn('Could not find a match for:', original);
                }
            } else {
                console.warn('Invalid improvement node:', improvementNodes[i].outerHTML);
            }
        }

        console.log('All improvements:', improvements);
        return improvements;
    }

    fuzzyFind(text, search, startIndex = 0) {
        console.log(`Fuzzy finding "${search}" in text starting from index ${startIndex}`);

        const searchLower = search.toLowerCase();
        const textLower = text.toLowerCase();

        let bestMatchIndex = -1;
        let bestMatchScore = 0;

        for (let i = startIndex; i <= textLower.length - searchLower.length; i++) {
            let matchScore = 0;
            for (let j = 0; j < searchLower.length; j++) {
                if (textLower[i + j] === searchLower[j]) {
                    matchScore++;
                }
            }
            if (matchScore > bestMatchScore) {
                bestMatchScore = matchScore;
                bestMatchIndex = i;
            }
            if (matchScore === searchLower.length) {
                break; // Perfect match found
            }
        }

        // Require at least 70% match
        const matchPercentage = bestMatchScore / searchLower.length;
        console.log(`Best match found at index ${bestMatchIndex} with ${matchPercentage.toFixed(2)}% match`);
        return matchPercentage > 0.7 ? bestMatchIndex : -1;
    }
}

export default TextAnalyzer;