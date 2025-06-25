import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class LlmService {
  async reinforceContext(prompt: string, duration: number): Promise<void> {
    const guidelines = [
      'Follow principles of good design (composition, color, balance, contrast, clarity, etc.)',
      'Obey physics (gravity, inertia, collisions, realistic motion, etc.)',
      'Use strict, realistic styling and animation',
      'Ensure animation duration matches the requested time (not less than user request)',
      'Promote realism and avoid abstract/unrealistic visuals unless explicitly requested',
      'Use top-notch styling and animation for realism and aesthetics',
      'All visualizations must be styled and physically plausible',
      'Use post-processing (e.g., bloom, tone mapping) for visual enhancement',
      'If user requests a specific duration, the video must be at least that long',
      'Use different shapes, correct motion, and physics based on the prompt',
    ];
    // In production, you may log or store this context for feedback/fine-tuning
    console.log('LLM reinforcement context:', { prompt, duration, guidelines });
  }

  async generateCode(prompt: string, duration: number) {
    await this.reinforceContext(prompt, duration);

    // Compose the system prompt for Gemini
    const systemPrompt = `
You are an expert 3D visualization developer using three.js.
Generate a complete JavaScript code snippet that:
- Visualizes the following concept: "${prompt}"
- Uses three.js and advanced post-processing (bloom, tone mapping, etc.) for realism.
- Uses GSAP for smooth, advanced animations.
- Uses CCapture.js to record the canvas as mp4 (assume CCapture is loaded as CCapture global).
- Uses troika-three-text for advanced 3D text/labels (assume TroikaText is loaded as global).
- Follows principles of good design (composition, color, balance, contrast, clarity, etc.).
- Obeys physics (gravity, inertia, collisions, realistic motion, etc.).
- Uses strict, realistic styling and animation.
- Ensures the animation duration matches the requested time (not less than ${duration} minute(s)).
- Promotes realism and avoids abstract/unrealistic visuals unless explicitly requested.
- Uses top-notch styling and animation for realism and aesthetics.
- All visualizations must be styled and physically plausible.
- The code must define a global function window.renderFrame(frame) that advances the animation by one frame.
- The code must be self-contained and assume three.js, GSAP, CCapture.js, and troika-three-text are already loaded.
- Do NOT include import statements or HTML, just the JavaScript code for the visualization.
`;

    // Call Gemini API
    const apiKey = process.env.GOOGLE_LLM_API_KEY;
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;

    const payload = {
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] }
      ]
    };

    let code = '';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      const candidates = (data as any)?.candidates;
      code = candidates?.[0]?.content?.parts?.[0]?.text || '';
      code = code.replace(/```(js|javascript)?/g, '').replace(/```/g, '').trim();
    } catch (err) {
      console.error('Gemini API error:', err);
      // Fallback: spinning torus knot with GSAP and troika-three-text
      code = `
        // Fallback: spinning torus knot with GSAP and troika-three-text
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640/480, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
        renderer.setClearColor(0x222233);
        renderer.setSize(640, 480);
        document.body.appendChild(renderer.domElement);

        // Lighting
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        scene.add(light);

        // Torus knot
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffcc, shininess: 100 });
        const knot = new THREE.Mesh(geometry, material);
        scene.add(knot);

        // Troika text
        const text = new TroikaText.Text();
        text.text = "Concept Visualizer";
        text.fontSize = 0.5;
        text.position.set(0, 2, 0);
        text.color = 0xffffff;
        scene.add(text);

        camera.position.z = 5;

        // GSAP animation
        if (typeof gsap !== 'undefined') {
          gsap.to(knot.rotation, { y: Math.PI * 2, repeat: -1, duration: 10, ease: "linear" });
        }

        window.renderFrame = function(frame) {
          renderer.render(scene, camera);
        };
      `;
    }

    // Ensure the returned code always calls renderer.render(scene, camera)
    // and that at least one mesh is added to the scene.
    // If the LLM returns code that does not render, fallback to default code.
    if (!/renderer\.render\s*\(/.test(code) || !/scene\.add\s*\(/.test(code)) {
      console.warn('LLM code missing render or scene.add, using fallback.');
      code = `
        // Fallback: spinning torus knot with GSAP and troika-three-text
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640/480, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
        renderer.setClearColor(0x222233);
        renderer.setSize(640, 480);
        document.body.appendChild(renderer.domElement);

        // Lighting
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        scene.add(light);

        // Torus knot
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffcc, shininess: 100 });
        const knot = new THREE.Mesh(geometry, material);
        scene.add(knot);

        // Troika text
        const text = new TroikaText.Text();
        text.text = "Concept Visualizer";
        text.fontSize = 0.5;
        text.position.set(0, 2, 0);
        text.color = 0xffffff;
        scene.add(text);

        camera.position.z = 5;

        // GSAP animation
        if (typeof gsap !== 'undefined') {
          gsap.to(knot.rotation, { y: Math.PI * 2, repeat: -1, duration: 10, ease: "linear" });
        }

        window.renderFrame = function(frame) {
          renderer.render(scene, camera);
        };
      `;
    }

    // Return code to be injected into Puppeteer page
    return { code };
  }

  async reinforce(trainingData: { prompt: string; expectedCode: string }) {
    // ...existing code...
    return { success: true, message: 'LLM reinforcement accepted (stub)' };
  }
}