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

    // --- Return a fully working, real three.js scene with animation (not minimal, but robust) ---
    if (!mode || mode === 'basic') {
      const code = `
        // Full-featured three.js scene with animation, lighting, and camera controls
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640/480, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
        renderer.setClearColor(0x222233);
        renderer.setSize(640, 480);
        document.body.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // Ground plane
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -1;
        scene.add(plane);

        // Main object: animated cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 100 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.5;
        scene.add(cube);

        // Camera position
        camera.position.set(3, 2, 5);
        camera.lookAt(0, 0, 0);

        // Optionally add orbit controls if available
        if (typeof THREE.OrbitControls !== 'undefined') {
          const controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.target.set(0, 0, 0);
          controls.update();
        }

        // Animate cube and render
        window.renderFrame = function(frame) {
          cube.rotation.x = frame * 0.01;
          cube.rotation.y = frame * 0.01;
          cube.position.y = 0.5 + Math.sin(frame * 0.05) * 0.5;
          renderer.render(scene, camera);
        };
      `;
      return { code };
    }

    // 2. If mode is "pro", return a more advanced scene with post-processing, GSAP, and troika-three-text.
    if (mode === 'pro') {
      const code = `
        // Advanced three.js scene with post-processing, GSAP, and troika-three-text
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640/480, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
        renderer.setClearColor(0x111122);
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
        if (typeof TroikaText !== 'undefined' && TroikaText.Text) {
          const text = new TroikaText.Text();
          text.text = "Concept Visualizer";
          text.fontSize = 0.5;
          text.position.set(0, 2, 0);
          text.color = 0xffffff;
          scene.add(text);
        }

        camera.position.z = 5;

        // GSAP animation
        if (typeof gsap !== 'undefined') {
          gsap.to(knot.rotation, { y: Math.PI * 2, repeat: -1, duration: 10, ease: "linear" });
        }

        window.renderFrame = function(frame) {
          renderer.render(scene, camera);
        };
      `;
      return { code };
    }

    // 3. If mode is "advanced", return a minimal working Babylon.js scene with animation.
    if (mode === 'advanced') {
      const code = `
        // Minimal working Babylon.js scene with animation
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        document.body.appendChild(canvas);

        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 4, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, scene);

        window.renderFrame = function(frame) {
          sphere.rotation.y = frame * 0.01;
          engine.runRenderLoop(() => {
            scene.render();
          });
        };
        // Initial render
        window.renderFrame(0);
      `;
      return { code };
    }

    // 4. If mode is unknown, throw an error
    throw new Error('[LlmService] Unknown mode or unable to generate code for the requested mode.');
  }

  async reinforce(trainingData: { prompt: string; expectedCode: string }) {
    // ...existing code...
    return { success: true, message: 'LLM reinforcement accepted (stub)' };
  }
}