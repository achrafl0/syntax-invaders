interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  alpha: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  update(deltaTime: number): void {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.dx * deltaTime;
      particle.y += particle.dy * deltaTime;
      particle.life -= deltaTime;
      particle.alpha = (particle.life / particle.maxLife) * 0.8;
      return particle.life > 0;
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const particle of this.particles) {
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  createLaserTrail(x: number, y: number, angle: number): void {
    const count = 3;
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 50 + 50;
      this.particles.push({
        x,
        y,
        dx: Math.cos(angle + spread) * -speed,
        dy: Math.sin(angle + spread) * -speed,
        alpha: 0.8,
        size: Math.random() * 2 + 1,
        color: "#00ffff",
        life: Math.random() * 0.3 + 0.2,
        maxLife: 0.5,
      });
    }
  }

  createShockwave(x: number, y: number): void {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Math.random() * 100 + 200;
      this.particles.push({
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        alpha: 0.8,
        size: Math.random() * 3 + 2,
        color: "#ffffff",
        life: Math.random() * 0.2 + 0.3,
        maxLife: 0.5,
      });
    }
  }

  createExplosion(x: number, y: number, color: string = "#ff0000"): void {
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 200 + 100;
      this.particles.push({
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        alpha: 1,
        size: Math.random() * 4 + 2,
        color,
        life: Math.random() * 0.5 + 0.5,
        maxLife: 1,
      });
    }
  }
}
