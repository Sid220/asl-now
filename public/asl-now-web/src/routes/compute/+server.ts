import {json} from '@sveltejs/kit';

export async function POST({request}: any) {
    const text = await request.text();
    const response = await fetch('http://sids-server-desktop:9001/infer/object_detection', {
        method: 'POST',
        body: JSON.stringify({
            "model_id": "asl-v7ssh/3",
            "model_type": "object-detection",
            "image": {
                "type": "base64",
                "value": text.split(',')[1]
            },
            "api_key": import.meta.env.ROBOFLOW_API,
            "confidence": 0.4
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    return json(await response.json());
}