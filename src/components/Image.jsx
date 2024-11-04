import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBase64 } from '../helpers/ImageHelper';

import './Image.css';

const Image = () => {
    const genAI = new GoogleGenerativeAI("AIzaSyBxVk0hfKGLQe9s2JK4GPMWuRvcaT40DN8");

    const [image, setImage] = useState('');
    const [imageInlineData, setImageInlineData] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiResponse, setResponse] = useState('');

    const prompt = `
    You are an advanced medical assistant AI, trained on comprehensive medical data up to December 2023. Upon receiving the following prescription or medical note, please deliver a structured and precise analysis encompassing the following components:
    
    1. **Identified Diseases or Conditions**: 
       - Extract and list all diseases or medical conditions mentioned in the document.
       - Include any relevant ICD-10 codes if applicable.
    
    2. **Symptoms or Abnormalities**: 
       - Identify and detail all symptoms or abnormalities noted in the document.
       - Suggest possible treatments or medications for these symptoms, including any lifestyle modifications or preventative measures.
    
    3. **Medications and Uses**: 
       - List all medications prescribed, along with their intended uses as specified in the document.
       - For each medication, include potential side effects, contraindications, and any necessary monitoring parameters (e.g., lab tests).
    
    4. **Treatment Plan**: 
       - Provide a detailed treatment plan that includes:
         - Recommended medications with specific dosages and frequency.
         - Duration of treatment.
         - Any additional therapeutic interventions (e.g., physical therapy, dietary changes).
         - Follow-up appointments or referrals to specialists.
    
    5. **Precautions**: 
       - Include any precautions or warnings related to the prescribed medications or treatment plan, especially for patients with comorbidities or allergies.
    
    Your response should be methodical, devoid of extraneous commentary, and strictly focused on the medical data presented. Your knowledge is based on medical data available up to December 2023.`;
    


    async function aiImageRun() {
        setLoading(true);
        setResponse('');

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-pro", 
            generationConfig: { temperature: 1 }, 
        });
        const result = await model.generateContentStream([prompt, imageInlineData]);

        setLoading(false);
        let fullResponse = '';
        
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            setResponse(fullResponse); 
        }

    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(await getBase64(file));
            const imagePart = await fileToGenerativePart(file);
            setImageInlineData(imagePart);
        }
    }

    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    }

    return (
        <>

            <div id='image'>
                {image && <img src={image} alt="Uploaded Preview" />}
                <div id='image-chat'>
                    {loading ? (
                        <div className="loading-placeholder">
                                <div className="placeholder-box"></div>
                                <div className="placeholder-box"></div>
                                <div className="placeholder-box"></div>
                        </div>
                    ) : aiResponse ? (
                        <ReactMarkdown>{aiResponse}</ReactMarkdown>
                    ) : (
                        <p>Upload any medical prescription or note to get started!</p>
                    )}
                </div>
                <div id='image-input'>
                    <input type="file" onChange={handleImageChange} />
                    <button onClick={aiImageRun} disabled={loading}>Analyze</button>
                </div>
            </div>

        </>
    );
};

export default Image;