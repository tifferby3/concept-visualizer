import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class LlmService {
  async reinforceContext(prompt: string, duration: number, mode?: string): Promise<void> {
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

  async generateCode(prompt: string, duration: number, mode?: string) {
    await this.reinforceContext(prompt, duration, mode);

    // Enhanced system prompt for Gemini
    const systemPrompt = `
You are an expert 3D visualization developer.
Generate a complete JavaScript code snippet that:
- Visualizes the following concept: "${prompt}"
- Uses ${mode === 'advanced' ? 'babylon.js' : 'three.js'}${mode === 'pro' ? ' with post-processing, GSAP, and troika-three-text' : ''}.
- The code MUST include at least one call to scene.add(...) and at least one call to renderer.render(scene, camera) (or engine.runRenderLoop for babylon.js).
- The code MUST define a global function window.renderFrame(frame) that advances the animation by one frame and calls renderer.render(scene, camera) (or equivalent).
- The code must be self-contained and assume all required libraries are loaded.
- Do NOT include import statements or HTML, just the JavaScript code for the visualization.
- Follows principles of good design, physics, and realism.
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
      console.log('LLM generated code:', code);
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
          knot.rotation.x = frame * 0.01;
          knot.rotation.y = frame * 0.01;
          renderer.render(scene, camera);
        };
      `;
    }

    // Post-process: inject minimal rendering logic if missing
    let needsInject = false;
    if (!/scene\.add\s*\(/.test(code)) {
      code += `
        // Injected: add a default mesh to the scene if missing
        if (typeof THREE !== 'undefined' && typeof scene !== 'undefined') {
          const geometry = new THREE.BoxGeometry();
          const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
        }
      `;
      needsInject = true;
    }
    if (!/renderer\.render\s*\(/.test(code) && !/engine\.runRenderLoop\s*\(/.test(code)) {
      code += `
        // Injected: ensure rendering occurs
        if (typeof renderer !== 'undefined' && typeof scene !== 'undefined' && typeof camera !== 'undefined') {
          renderer.render(scene, camera);
        }
      `;
      needsInject = true;
    }
    if (needsInject) {
      console.warn('LLM code was missing required rendering logic. Injected minimal rendering code.');
    }

    return { code };
  }

  async reinforce(trainingData: { prompt: string; expectedCode: string }) {
    // ...existing code...
    return { success: true, message: 'LLM reinforcement accepted (stub)' };
  }
}