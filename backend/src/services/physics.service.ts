import { Injectable } from '@nestjs/common';

/**
 * PhysicsService provides definitions and utilities for physical objects,
 * how to create them, when to use them, and common physics scenarios.
 * This service can be used by the LLM service to guide scene/code generation.
 */
@Injectable()
export class PhysicsService {
  // Supported object types and their creation logic
  getSupportedObjects() {
    return [
      'sphere',
      'box',
      'plane',
      'cylinder',
      'cone',
      'torus',
      'capsule',
      'compound',
      'softbody',
      'cloth',
      'rope',
      'particle',
    ];
  }

  // Example: Get creation code snippet for a given object type (three.js style)
  getCreationSnippet(type: string): string {
    switch (type) {
      case 'sphere':
        return 'new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), material)';
      case 'box':
        return 'new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)';
      case 'plane':
        return 'new THREE.Mesh(new THREE.PlaneGeometry(width, height), material)';
      case 'cylinder':
        return 'new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32), material)';
      case 'cone':
        return 'new THREE.Mesh(new THREE.ConeGeometry(radius, height, 32), material)';
      case 'torus':
        return 'new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 16, 100), material)';
      case 'capsule':
        return '// Capsule: Use THREE.CapsuleGeometry if available or custom geometry';
      case 'compound':
        return '// Compound: Combine multiple meshes using THREE.Group()';
      case 'softbody':
        return '// Softbody: Use physics engine integration (e.g., ammo.js)';
      case 'cloth':
        return '// Cloth: Use physics engine or custom vertex animation';
      case 'rope':
        return '// Rope: Use physics engine or line segments with constraints';
      case 'particle':
        return 'new THREE.Points(geometry, material)';
      default:
        return '// Unknown object type';
    }
  }

  // When to use each object type (scenarios)
  getUsageScenarios(type: string): string {
    switch (type) {
      case 'sphere':
        return 'Use for balls, planets, bubbles, or any round object.';
      case 'box':
        return 'Use for crates, buildings, dice, or any rectangular object.';
      case 'plane':
        return 'Use for ground, walls, water surfaces, or backgrounds.';
      case 'cylinder':
        return 'Use for pillars, cans, tubes, or wheels.';
      case 'cone':
        return 'Use for trees, spikes, or cones.';
      case 'torus':
        return 'Use for rings, donuts, or loops.';
      case 'capsule':
        return 'Use for characters, pills, or rounded bars.';
      case 'compound':
        return 'Use for complex objects made from multiple shapes.';
      case 'softbody':
        return 'Use for cloth, jelly, or deformable objects.';
      case 'cloth':
        return 'Use for flags, curtains, or clothing.';
      case 'rope':
        return 'Use for ropes, cables, or chains.';
      case 'particle':
        return 'Use for effects like smoke, fire, or rain.';
      default:
        return 'General 3D object.';
    }
  }

  // Common physics scenarios
  getPhysicsScenarios() {
    return [
      'gravity',
      'collision',
      'friction',
      'bouncing',
      'rolling',
      'sliding',
      'stacking',
      'breaking',
      'softbody deformation',
      'fluid simulation',
      'wind',
      'constraints (hinge, spring, etc.)',
    ];
  }

  // Expose a summary for LLM prompt/context usage
  getLLMPhysicsSummary(): string {
    return `
Supported physics objects: ${this.getSupportedObjects().join(', ')}.

Creation snippets:
${this.getSupportedObjects().map(type => `- ${type}: ${this.getCreationSnippet(type)}`).join('\n')}

Usage scenarios:
${this.getSupportedObjects().map(type => `- ${type}: ${this.getUsageScenarios(type)}`).join('\n')}

Common physics scenarios: ${this.getPhysicsScenarios().join(', ')}.
`;
  }
}
