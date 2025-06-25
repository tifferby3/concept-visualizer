import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  async reinforceContext(prompt: string, duration: number): Promise<void> {
    // Guidelines for LLM
    const guidelines = [
      'Follow principles of good design (composition, color, balance, contrast, clarity, etc.)',
      'Obey physics (gravity, inertia, collisions, realistic motion, etc.)',
      'Use strict, realistic styling and animation',
      'Ensure animation duration matches the requested time (not less than user request)',
      'Promote realism and avoid abstract/unrealistic visuals unless explicitly requested',
      'Use top-notch styling and animation for realism and aesthetics',
      'All visualizations must be styled and physically plausible',
      'If user requests a specific duration, the video must be at least that long',
    ];
    // Log for now, but in production, send to LLM as context
    console.log('LLM reinforcement context:', { prompt, duration, guidelines });
  }

  async generateCode(prompt: string, duration: number) {
    await this.reinforceContext(prompt, duration);

    // Simple branching logic for demonstration
    let code: string;

    if (/solar system/i.test(prompt)) {
      code = `
        // Solar system visualization
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640/480, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
        renderer.setClearColor(0x000000);
        renderer.setSize(640, 480);
        document.body.appendChild(renderer.domElement);

        // Sun
        const sunGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        // Earth
        const earthGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2266ff });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // Light
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(5, 5, 5);
        scene.add(light);

        camera.position.z = 3;

        window.renderFrame = function(frame) {
          const t = frame * 0.01;
          earth.position.x = Math.cos(t) * 1.5;
          earth.position.z = Math.sin(t) * 1.5;
          renderer.render(scene, camera);
        };
      `;
    } else if (/bouncing ball/i.test(prompt)) {
      code = `
        // Bouncing ball visualization
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640/480, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
        renderer.setClearColor(0x222233);
        renderer.setSize(640, 480);
        document.body.appendChild(renderer.domElement);

        // Ball
        const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333, shininess: 100 });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        scene.add(ball);

        // Floor
        const floorGeometry = new THREE.BoxGeometry(2, 0.1, 2);
        const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        scene.add(floor);

        // Light
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(5, 5, 5);
        scene.add(light);

        camera.position.z = 3;

        window.renderFrame = function(frame) {
          const t = frame * 0.05;
          ball.position.y = Math.abs(Math.sin(t)) * 1 - 0.2;
          renderer.render(scene, camera);
        };
      `;
    } else {
      // Default: spinning, styled cube
      code = `
        // Styled spinning cube (default)
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640/480, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
        renderer.setClearColor(0x222233);
        renderer.setSize(640, 480);
        document.body.appendChild(renderer.domElement);

        // Lighting for realism
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        scene.add(light);

        // Styled cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffcc, shininess: 100 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        window.renderFrame = function(frame) {
          cube.rotation.x = frame * 0.01;
          cube.rotation.y = frame * 0.01;
          renderer.render(scene, camera);
        };
      `;
    }

    return { code };
  }

  async reinforce(trainingData: { prompt: string; expectedCode: string }) {
    // ...existing code...
    return { success: true, message: 'LLM reinforcement accepted (stub)' };
  }
}