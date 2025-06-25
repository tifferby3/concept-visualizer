import { Injectable } from '@nestjs/common';
import { PhysicsService } from './physics.service';
import { MathematicsService } from './mathematics.service';
import { ShapesService } from './shapes.service';
import { LlmService } from './llm.service';

@Injectable()
export class LlmOrchestrationService {
  constructor(
    private readonly physics: PhysicsService,
    private readonly math: MathematicsService,
    private readonly shapes: ShapesService,
    private readonly llm: LlmService
  ) {}

  async generateVisualization(prompt: string, duration: number, mode?: string) {
    // 1. Gather context
    const physicsContext = this.physics.getLLMPhysicsSummary();
    const shapesList = this.shapes.getSupportedShapes();
    const mathContext = 'Mathematics available: vector math, geometry, calculus, statistics, trigonometry, randomization, physics helpers.';

    // 2. Define shapes (could be more advanced: parse prompt, suggest shapes)
    const shapesContext = `Available shapes: ${shapesList.join(', ')}.`;

    // 3. Visualize output (plan scene structure, e.g., suggest main object, ground, lighting)
    const visualizationPlan = `
Scene plan:
- Main object: Use a relevant shape for the concept.
- Add ground plane if appropriate.
- Add lighting for realism.
- Animate at least one property (rotation, position, scale, color, etc.).
`;

    // 4. Create 3D code: Build a structured context for the LLM
    const llmContext = `
Prompt: ${prompt}
Duration: ${duration} minute(s)
Mode: ${mode || 'basic'}
${physicsContext}
${mathContext}
${shapesContext}
${visualizationPlan}
`;

    // 5. Call LLM to generate code
    const { code } = await this.llm.generateCode(llmContext, duration, mode);

    // 6. Analyze output (validate code)
    let valid = false;
    try {
      // Basic validation: must contain scene/camera/renderer setup and animation
      valid =
        /new THREE\.Scene\s*\(/.test(code) &&
        /new THREE\.PerspectiveCamera\s*\(/.test(code) &&
        /new THREE\.WebGLRenderer\s*\(/.test(code) &&
        /scene\.add\s*\(/.test(code) &&
        /renderer\.render\s*\(/.test(code) &&
        /window\.renderFrame\s*=/.test(code);
    } catch {
      valid = false;
    }

    // 7. Refine output if invalid (optionally re-prompt or throw error)
    if (!valid) {
      throw new Error('[LlmOrchestrationService] LLM did not generate valid 3D scene code. Please refine your prompt or check LLM configuration.');
    }

    // Return the generated code
    return { code };
  }
}
