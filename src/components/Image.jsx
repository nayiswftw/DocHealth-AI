import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBase64 } from '../helpers/ImageHelper';
import './Image.css';

const Image = () => {
    const genAI = new GoogleGenerativeAI("AIzaSyBxVk0hfKGLQe9s2JK4GPMWuRvcaT40DN8");

    const [image, setImage] = useState('');
    const [imageInlineData, setImageInlineData] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const prompt = `
You are a highly accurate and professional medical assistant AI. Given the following prescription or medical note, provide a concise analysis that includes:

- Identified Diseases or Conditions: Extract and list any diseases or medical conditions mentioned in the document. 
- Symptoms or Abnormalities: Identify and detail any symptoms or abnormalities noted in the document. Suggest possible treatments or medications and Precautions.
- Medications and Uses: List the medications prescribed, along with their intended uses as specified in the document. Suggest any potential side effects or contraindications.
- Treatment Plan: Provide a detailed treatment plan that includes the recommended medications, dosages, and any other necessary steps from the provided data.

Ensure your response is clear, structured, and focuses strictly on the medical data provided, avoiding any extraneous commentary or interpretation. Your knowledge is based on medical data available up to December 2023.`;

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file || !file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            return;
        }

        try {
            const base64Image = await getBase64(file);
            setImage(base64Image);
            const inlineData = await fileToGenerativePart(file);
            setImageInlineData(inlineData);
            setError('');
        } catch (err) {
            setError('Error uploading file. Please try again.');
        }
    };

    const fileToGenerativePart = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve({ data: reader.result.split(',')[1], mimeType: file.type });
            };
            reader.readAsDataURL(file);
        });
    };

    const aiImageRun = async () => {
        setLoading(true);
        setResponse('');
        setError('');

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", generationConfig: { temperature: 0 } });
            const result = await model.generateContent([prompt, imageInlineData]);
            const text = await result.response.text();
            setResponse(text);
        } catch (err) {
            setError('Error generating AI response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id='image'>
            {image && <img src={image} alt="Uploaded Preview" />}
            <div id='image-chat'>
                {loading ? (
                    <p>Loading...</p>
                ) : aiResponse ? (
                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                ) : (
                    <p>Upload any medical prescription or note to get started!</p>
                )}
                {error && <p className="error">{error}</p>}
            </div>
            <div id='image-input'>
                <input type="file" onChange={handleImageChange} />
                <button onClick={aiImageRun} disabled={loading}>Analyze</button>
            </div>
        </div>
    );
};

export default Image;
