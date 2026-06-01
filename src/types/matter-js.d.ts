/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'matter-js' {
  interface MatterBody {
    id: number;
    position: { x: number; y: number };
    isStatic: boolean;
    render: any;
  }

  const Matter: {
    Engine: {
      create(options?: any): any;
      clear(engine: any): void;
    };
    Render: {
      create(options: any): any;
      run(render: any): void;
      stop(render: any): void;
    };
    Runner: {
      create(): any;
      run(runner: any, engine: any): void;
      stop(runner: any): void;
    };
    Bodies: {
      circle(x: number, y: number, radius: number, options?: any): MatterBody;
      rectangle(x: number, y: number, width: number, height: number, options?: any): MatterBody;
    };
    Body: {
      setPosition(body: MatterBody, position: { x: number; y: number }): void;
      setVelocity(body: MatterBody, velocity: { x: number; y: number }): void;
    };
    Composite: {
      add(composite: any, objects: any): void;
      allBodies(composite: any): MatterBody[];
    };
    Mouse: {
      create(element: HTMLElement): any;
    };
    MouseConstraint: {
      create(engine: any, options: any): any;
    };
    Events: {
      on(object: any, eventName: string, callback: (event: any) => void): void;
    };
  };
  export default Matter;
}
