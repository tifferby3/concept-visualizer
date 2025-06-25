import { Injectable } from '@nestjs/common';

/**
 * MathematicsService provides utilities for pure mathematical calculations,
 * such as vector math, geometry, trigonometry, calculus, statistics, randomization, and more.
 * This service can be used by other services (e.g., PhysicsService) for calculations
 * including fluid dynamics, air resistance, object sizes, forces, energy, etc.
 */
@Injectable()
export class MathematicsService {
  // Vector math
  addVectors(a: [number, number, number], b: [number, number, number]): [number, number, number] {
    // [a1 + b1, a2 + b2, a3 + b3]
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  subtractVectors(a: [number, number, number], b: [number, number, number]): [number, number, number] {
    // [a1 - b1, a2 - b2, a3 - b3]
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  dotProduct(a: [number, number, number], b: [number, number, number]): number {
    // a1*b1 + a2*b2 + a3*b3
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  }

  crossProduct(a: [number, number, number], b: [number, number, number]): [number, number, number] {
    // [a2*b3 - a3*b2, a3*b1 - a1*b3, a1*b2 - a2*b1]
    return [
      a[1]*b[2] - a[2]*b[1],
      a[2]*b[0] - a[0]*b[2],
      a[0]*b[1] - a[1]*b[0]
    ];
  }

  magnitude(v: [number, number, number]): number {
    // sqrt(v1^2 + v2^2 + v3^2)
    return Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
  }

  normalize(v: [number, number, number]): [number, number, number] {
    // v / |v|
    const mag = this.magnitude(v);
    return mag === 0 ? [0, 0, 0] : [v[0]/mag, v[1]/mag, v[2]/mag];
  }

  // Geometry
  distance(a: [number, number, number], b: [number, number, number]): number {
    // |a - b|
    return this.magnitude(this.subtractVectors(a, b));
  }

  sphereVolume(radius: number): number {
    // (4/3) * π * r^3
    return (4 / 3) * Math.PI * Math.pow(radius, 3);
  }

  boxVolume(width: number, height: number, depth: number): number {
    // width * height * depth
    return width * height * depth;
  }

  cylinderVolume(radius: number, height: number): number {
    // π * r^2 * h
    return Math.PI * Math.pow(radius, 2) * height;
  }

  // Trigonometry
  degToRad(degrees: number): number {
    // degrees * π / 180
    return degrees * (Math.PI / 180);
  }

  radToDeg(radians: number): number {
    // radians * 180 / π
    return radians * (180 / Math.PI);
  }

  // Calculus
  derivative(f: (x: number) => number, x: number, h = 1e-5): number {
    // (f(x + h) - f(x - h)) / (2h)
    return (f(x + h) - f(x - h)) / (2 * h);
  }

  integral(f: (x: number) => number, a: number, b: number, n = 1000): number {
    // ∫_a^b f(x) dx ≈ sum(f(xi) * dx)
    const dx = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += f(a + i * dx) * dx;
    }
    return sum;
  }

  // Statistics
  mean(arr: number[]): number {
    // (Σx) / n
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  variance(arr: number[]): number {
    // mean((x - mean)^2)
    const m = this.mean(arr);
    return this.mean(arr.map(x => (x - m) ** 2));
  }

  stddev(arr: number[]): number {
    // sqrt(variance)
    return Math.sqrt(this.variance(arr));
  }

  // Randomization
  randomInRange(min: number, max: number): number {
    // random between min and max
    return Math.random() * (max - min) + min;
  }

  randomIntInRange(min: number, max: number): number {
    // random integer between min and max (inclusive)
    return Math.floor(this.randomInRange(min, max + 1));
  }

  // Physics helpers
  reynoldsNumber(density: number, velocity: number, length: number, viscosity: number): number {
    // (density * velocity * length) / viscosity
    return (density * velocity * length) / viscosity;
  }

  dragForce(dragCoefficient: number, area: number, density: number, velocity: number): number {
    // 0.5 * Cd * A * ρ * v^2
    return 0.5 * dragCoefficient * area * density * velocity * velocity;
  }

  kineticEnergy(mass: number, velocity: number): number {
    // 0.5 * m * v^2
    return 0.5 * mass * velocity * velocity;
  }

  force(mass: number, acceleration: number): number {
    // F = m * a
    return mass * acceleration;
  }

  pressure(force: number, area: number): number {
    // P = F / A
    return force / area;
  }

  // Ability to connect to PhysicsService for advanced scenarios
  private physicsService?: any;
  setPhysicsService(physicsService: any) {
    this.physicsService = physicsService;
  }
}
