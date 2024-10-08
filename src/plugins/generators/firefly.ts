import Snap from 'snapsvg';

export function initFireflies(container: HTMLElement) {
  'use strict';

  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const svg = Snap(width * 1.15, height * 1.15);
  const svgWidth = parseInt(svg.node.getAttribute('width') || '0');
  const svgHeight = parseInt(svg.node.getAttribute('height') || '0');

  const MAX_FIREFLIES = 35;
  const FIREFLY_SPEED = 15000;
  const FIREFLY_BLINK_SPEED = 4000;
  const BASE_PATH_WIDTH = 275;

  container.appendChild(svg.node);

  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  class FireFly {
    group: any;
    path: any;
    circle: any;

    constructor() {
      this.group = this.generateGroup();
      this.path = this.group[0];
      this.circle = this.group[1];
    }

    private generateTransform(): string {
      const leftPosition = (svgWidth - BASE_PATH_WIDTH) / 2;
      const topPosition = (svgHeight - BASE_PATH_WIDTH) / 2;
      return `t${leftPosition},${topPosition},r${getRandomInt(1, 359)}`;
    }

    private generateGroup(): any[] {
      const group = svg.g();
      const path = this.generatePath();
      const coords = path.getPointAtLength(0);
      const circle = this.generateCircle(coords.x, coords.y);

      group.add(circle);
      group.transform(this.generateTransform());
      return [path, circle, group];
    }

    private generatePath(): any {
      const randomPath = [
        'M1.453125,-0.55859375 C75.5625,76.515625 152.230469,34.4414062 152.230469,34.4414062 C152.230469,34.4414062 276.964844,-36.1484375 250.523438,67.8125 C224.082031,171.773438 261.673768,157.95441 250.523438,195.105469 C239.373107,232.256527 293.597656,283.253906 194.042969,255.996094 C94.4882812,228.738281 90.96875,224.03125 54.3398438,255.996094 C17.7109375,287.960937 -22.921875,252.710938 25.265625,195.105469 C73.453125,137.5 64.2304688,137.5 47.7460938,118.441406 C31.2617188,99.3828125 22.0820312,80.8085938 32.0078125,57.625 C41.9335938,34.4414062 129.597656,-36.703125 154.746094,91.6640625 C179.894531,220.03125 264.859375,262.847656 264.859375,262.847656',
        'M0.5625,-0.078125 C0.5625,-0.078125 266.597656,77.9179687 261.859375,202.105469 C257.121094,326.292969 89.5748377,243.911913 53.8242188,192.550781 C18.0735998,141.189649 -26.9921875,-14.5625 89.265625,15.328125 C205.523438,45.21875 234.232847,74.6313182 251.5625,121.585938 C268.892153,168.540557 290.335938,281.546875 171.746094,238.808594 C53.15625,196.070312 240.042969,12.6601562 240.042969,12.6601562',
        'M1.08203125,-0.66796875 C-17.9377166,-21.4041628 9.15625,64.2929688 72.9335937,64.2929688 C136.710937,64.2929688 87.8177529,-21.0716058 150.488281,12.1445312 C213.15881,45.3606683 293.046875,52.3984375 260.488281,163.699219 C227.929687,275 148.199223,260.893557 94.5625,254.144531 C40.9257767,247.395506 -4.25,191.734375 14.7109375,132.773438 C33.671875,73.8125 173.96875,86.4023438 173.96875,86.4023438 C173.96875,86.4023438 284.410156,108.921875 217.449219,167.699219 C150.488281,226.476562 74.671875,186.03125 74.671875,186.03125 C74.671875,186.03125 -8.80859375,153.144531 77.96875,119.773438 C164.746094,86.4023438 254.339844,262.070312 254.339844,262.070312',
      ];

      const path = svg
        .path(randomPath[getRandomInt(0, randomPath.length - 1)])
        .attr({
          fill: 'none',
          strokeWidth: '0',
        });

      return path;
    }

    private generateCircle(cx: number, cy: number): any {
      const circle = svg.circle(5, 5, 2).attr({
        fill: '#CFF09E',
        stroke: '#ffffff',
        strokeOpacity: 0.1,
        strokeWidth: 5,
        opacity: 0,
        class: 'firefly',
        zIndex: 1,
        cx: cx,
        cy: cy,
      });

      return circle;
    }

    private blink(): void {
      this.circle.animate({ opacity: 1 }, FIREFLY_BLINK_SPEED / 2, () => {
        this.circle.animate({ opacity: 0 }, FIREFLY_BLINK_SPEED / 4);
      });
      setTimeout(() => this.blink(), FIREFLY_BLINK_SPEED);
    }

    private fly(): void {
      const length = this.path.getTotalLength();

      Snap.animate(
        0,
        length,
        (value: number) => {
          const movePoint = this.path.getPointAtLength(value);
          this.circle.attr({ cx: movePoint.x, cy: movePoint.y });
        },
        FIREFLY_SPEED,
        mina.linear
      );

      setTimeout(() => this.fly(), FIREFLY_SPEED);
    }

    delay(): void {
      setTimeout(
        () => {
          this.blink();
          this.fly();
        },
        getRandomInt(1, 10) * 1000
      );
    }
  }

  const fireFlies: FireFly[] = [];

  for (let i = 0; i < MAX_FIREFLIES; i++) {
    fireFlies.push(new FireFly());
    fireFlies[i].delay();
  }
}
