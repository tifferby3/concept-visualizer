import { Injectable } from '@nestjs/common';
import { MathematicsService } from './mathematics.service';
import { PhysicsService } from './physics.service';

/**
 * ShapesService defines and manages all supported 3D shapes,
 * provides their geometric and physical properties,
 * and integrates with MathematicsService and PhysicsService for calculations.
 */
@Injectable()
export class ShapesService {
  constructor(
    private readonly math: MathematicsService,
    private readonly physics: PhysicsService
  ) {}

  // List of supported shapes
  getSupportedShapes() {
    return [
      'sphere',
      'box',
      'cylinder',
      'cone',
      'torus',
      'capsule',
      'plane',
      'particle',
      'compound',
      'softbody',
      'cloth',
      'rope'
    ];
  }

  // Geometric properties for each shape
  getShapeProperties(shape: string, params: any): any {
    switch (shape) {
      case 'sphere':
        return {
          volume: this.math.sphereVolume(params.radius),
          surfaceArea: 4 * Math.PI * Math.pow(params.radius, 2)
        };
      case 'box':
        return {
          volume: this.math.boxVolume(params.width, params.height, params.depth),
          surfaceArea: 2 * (params.width * params.height + params.width * params.depth + params.height * params.depth)
        };
      case 'cylinder':
        return {
          volume: this.math.cylinderVolume(params.radius, params.height),
          surfaceArea: 2 * Math.PI * params.radius * (params.radius + params.height)
        };
      case 'cone':
        return {
          volume: (1 / 3) * Math.PI * Math.pow(params.radius, 2) * params.height,
          surfaceArea: Math.PI * params.radius * (params.radius + Math.sqrt(Math.pow(params.height, 2) + Math.pow(params.radius, 2)))
        };
      case 'torus':
        return {
          volume: 2 * Math.PI * Math.PI * params.radius * Math.pow(params.tube, 2),
          surfaceArea: 4 * Math.PI * Math.PI * params.radius * params.tube
        };
      case 'capsule':
        // Approximate as cylinder + two hemispheres
        const cylVol = this.math.cylinderVolume(params.radius, params.height);
        const sphVol = this.math.sphereVolume(params.radius);
        return {
          volume: cylVol + sphVol,
          surfaceArea: 2 * Math.PI * params.radius * params.height + 4 * Math.PI * Math.pow(params.radius, 2)
        };
      case 'plane':
        return {
          area: params.width * params.height
        };
      case 'particle':
        return {
          description: 'Point mass or visual marker, no volume.'
        };
      case 'compound':
        return {
          description: 'Combination of multiple shapes. Properties depend on components.'
        };
      case 'softbody':
        return {
          description: 'Deformable object. Properties depend on simulation.'
        };
      case 'cloth':
        return {
          area: params.width * params.height,
          description: 'Flexible surface, area only.'
        };
      case 'rope':
        return {
          length: params.length,
          description: 'Flexible 1D object, length only.'
        };
      default:
        return { description: 'Unknown shape.' };
    }
  }

  // Example: Get recommended physics scenario for a shape
  getRecommendedPhysics(shape: string): string {
    switch (shape) {
      case 'sphere':
        return 'Ideal for rolling, bouncing, and collision scenarios.';
      case 'box':
        return 'Stacking, sliding, and collision scenarios.';
      case 'cylinder':
        return 'Rolling, stacking, and collision scenarios.';
      case 'cone':
        return 'Stacking, collision, and as projectiles.';
      case 'torus':
        return 'Rolling, spinning, and decorative uses.';
      case 'capsule':
        return 'Character controllers, collision, and rolling.';
      case 'plane':
        return 'Ground, walls, or boundaries.';
      case 'particle':
        return 'Particle systems, effects, or point masses.';
      case 'compound':
        return 'Complex objects, vehicles, or articulated bodies.';
      case 'softbody':
        return 'Jelly, cloth, or deformable simulations.';
      case 'cloth':
        return 'Flags, curtains, or clothing simulation.';
      case 'rope':
        return 'Ropes, cables, or chains with constraints.';
      default:
        return 'General 3D object.';
    }
  }

  // Integrate with PhysicsService for advanced calculations
  getPhysicsForShape(shape: string, params: any): any {
    switch (shape) {
      case 'sphere':
        return {
          drag: this.physics.dragForce(params.dragCoefficient, 4 * Math.PI * Math.pow(params.radius, 2), params.density, params.velocity),
          reynolds: this.physics.reynoldsNumber(params.density, params.velocity, params.radius * 2, params.viscosity)
        };
      case 'box':
        return {
          drag: this.physics.dragForce(params.dragCoefficient, 2 * (params.width * params.height + params.width * params.depth + params.height * params.depth), params.density, params.velocity)
        };
      // Add more as needed...
      default:
        return {};
    }
  }
}
