// ../grammer/sentenceImprover.js

import OllamaService from '../services/ollamaService.js';

class SentenceImprover {
    constructor() {
        this.ollamaService = new OllamaService();
    }

    async improveSentence(text) {
        try {
            if (text.length <= 15) {
                // For short text, improve directly
                return await this.improveText(text);
            } else {
                // For longer text, split into sentences first
                const sentences = await this.splitIntoSentences(text);
                const improvedSentences = await this.improveIndividualSentences(sentences);
                return improvedSentences.join(' ');
            }
        } catch (error) {
            console.error('Error improving sentence:', error);
            return text; // Return original text if there's an error
        }
    }

    async splitIntoSentences(text) {
        const prompt = `
        Split the following text into individual sentences. Enclose each sentence in an XML block with tags <sentence1>, <sentence2>, etc. Preserve all original punctuation and spacing within the sentences. Here's the text to split:
        <text>${text}</text>
        Return only the XML blocks without any additional explanation.
        `;

        const response = await this.ollamaService.query('gemma2:2b', prompt, { stream: false });
        return this.parseSentencesFromXml(response);
    }

    parseSentencesFromXml(xmlString) {
        const sentences = [];
        const regex = /<sentence\d+>(.*?)<\/sentence\d+>/g;
        let match;
        while ((match = regex.exec(xmlString)) !== null) {
            sentences.push(match[1]);
        }
        return sentences;
    }

    async improveIndividualSentences(sentences) {
        const improvedSentences = [];
        for (const sentence of sentences) {
            const improvedSentence = await this.improveText(sentence);
            improvedSentences.push(improvedSentence);
        }
        return improvedSentences;
    }

    async improveText(text) {
        const prompt = `Proofread and improve the following sentence , adjusting it to match a "Academic" tone. If improvements are needed, enclose the result in <improved> tags. If no improvements are needed, enclose the original text in <noneed> tags.

        Sentence to proofread (aiming for a "Academic" tone) ,  Do not include any explanations or additional XML/HTML tags or comments :
        <sentence>${text}</sentence>`; return await this.ollamaService.query('gemma2:2b', prompt, { stream: false });
    }
}

export default SentenceImprover;