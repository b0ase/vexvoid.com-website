// Generative p5.js Algorithm Library for V3XV0ID
// These algorithms create dynamic visual patterns for video composition

export interface GenerativeAlgorithm {
  id: string
  name: string
  description: string
  code: string
  setup: string
  params?: {
    speed?: number
    opacity?: number
    color?: string
  }
}

export const generativeAlgorithms: GenerativeAlgorithm[] = [
  {
    id: 'spiral-wave-1',
    name: 'Spiral Wave Pattern',
    description: 'Complex spiral with sine wave modulation and radial distortion',
    code: `a=(x,y,d=mag(k=(4+sin(y*2-t)*3)*cos(x/29),e=y/8-13))=>point((q=3*sin(k*2)+.3/k+sin(y/25)*k*(9+4*sin(e*9-d*3+t*2)))+30*cos(c=d-t)+200,q*sin(c)+d*39-220)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/240,i=1e4;i--;)a(i,i/235)}`
  },
  {
    id: 'radial-flow-1',
    name: 'Radial Flow Pattern',
    description: 'Radial flow with atan2 modulation and temporal oscillation',
    code: `a=(x,y,d=mag(k=4*cos(x/29),e=y/7-13))=>point((q=3*sin(atan2(k,e)*19)+sin(y/19)*k*(9+2*sin(e*9-d*3+t/4)))+60*cos(c=d-t/8)+200,q*sin(c)+d*39-195)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,146);for(t+=PI/15,i=1e4;i--;)a(i,i/235)}`
  },
  {
    id: 'polar-distortion-1',
    name: 'Polar Distortion Field',
    description: 'Polar coordinate distortion with squared magnitude scaling',
    code: `a=(x,y,d=mag(k=5*cos(x/14)*cos(y/30),e=y/8-13)**2/59+4)=>point((q=60-3*sin(atan2(k,e)*e)+k*(3+4/d*sin(d*d-t*2)))*sin(c=d/2+e/99-t/18)+200,(q+d*9)*cos(c)+200)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,66);for(t+=PI/20,i=1e4;i--;)a(i%200,i/43)}`
  },
  {
    id: 'oscillating-field-1',
    name: 'Oscillating Field Pattern',
    description: 'Field pattern with temporal sine modulation and scaled magnitude',
    code: `a=(x,y,d=mag(k=9*cos(x/8),e=y/8-12.5)**2/99+sin(t)/6+.5)=>point((q=99-e*sin(atan2(k,e)*7)/d+k*(3+cos(d*d-t)*2))*sin(c=d/2+e/69-t/16)+200,(q+19*d)*cos(c)+200)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,66);for(t+=PI/45,i=1e4;i--;)a(i%200,i/55)}`
  },
  {
    id: 'cubic-flow-1',
    name: 'Cubic Flow Distortion',
    description: 'Cubic magnitude scaling with cosine temporal modulation',
    code: `a=(x,y,d=mag(k=11*cos(x/8),e=y/8-12.5)**3/1499+cos(e/4+t*2)/5+1)=>point((q=99-e*sin(e)/d+k*(3+sin(d*d-t*2)))*sin(c=d/2+e/99-t/8)+200,(q+19*d)*cos(c)+200)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,66);for(t+=PI/90,i=1e4;i--;)a(i%200,i/50)}`
  },
  {
    id: 'tangent-wave-1',
    name: 'Tangent Wave Complex',
    description: 'Complex pattern using tangent functions with nested trigonometry',
    code: `a=(x,y,o=mag(k=x/4-12.5,e=y/9)/9)=>point((q=99+3*(tan(y/2)/2+cos(y))/k+k*(3+cos(y)/3+sin(e+o*4-t*2)))*cos(c=o/4+e/4-t/8)*cos(c/2-e/3+t/8)+200,q*sin(c)+200)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(6).stroke(w,46);for(t+=PI/90,i=3e4;i--;)a(i%100,i/350)}`
  },
  {
    id: 'sine-modulated-1',
    name: 'Sine Modulated Flow',
    description: 'Flow pattern with sine modulation and complex coordinate transformation',
    code: `a=(x,y,o=mag(k=x/4-12.5,e=y/9)/9)=>point((q=x/3+99+3/k*sin(y)+k*(1+cos(y)/3+sin(e+o*4-t*2)))*cos(c=o/5+e/4-t/8)+200,(q+49)*sin(c)*cos(c)-q/3+30*o+220)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(6).stroke(w,46);for(t+=PI/90,i=2e4;i--;)a(i%100,i/350)}`
  },
  {
    id: 'absolute-cosine-1',
    name: 'Absolute Cosine Field',
    description: 'Field based on absolute cosine values with complex modulation',
    code: `a=(x,y,d=abs(e=cos(k=x/8-12.5)+sin(y/24)+cos(k/2)))=>point((q=x/4+90+d*k*(1+cos(d*4-t*2+y/72)))*cos(c=y*e/594-t/8+d/6)+200,(q/2+99*cos(c/2))*sin(c)+e*6+200)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(6).stroke(w,36);for(t+=PI/60,i=4e4;i--;)a(i%200,i/200)}`
  },
  {
    id: 'scaled-cosine-1',
    name: 'Scaled Cosine Pattern',
    description: 'Scaled pattern with cosine base and complex coordinate scaling',
    code: `a=(x,y,k=x/8-12.5,d=abs(e=cos(k)+sin(y/3)+cos(k/2)))=>point((q=x/4+90+d*k*(.5+cos(d*4-t*2+y/12)))*.7*(cos(c=y*e/198-t/8+d/5))+200,(q+70)*.7*sin(c)+200)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(0,96).stroke(w,26);for(t+=PI/90,i=4e4;i--;)a(i%200,i/500)}`
  },
  {
    id: 'temporal-sine-1',
    name: 'Temporal Sine Modulation',
    description: 'Pattern with temporal sine modulation and coordinate offset',
    code: `a=(x,y,k=x/8-12.5,d=cos(k/2)+sin(y/3)-.5)=>point((q=x/4+60+d*k*(1+cos(d*4-t*2+y/14)))*.7*cos(c=y*d/169-t/8+d/9)+200+60*sin(t*3/32+c/4),(q+59)*.7*sin(c)+200)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(0).stroke(w,36);for(t+=PI/30,i=4e4;i--;)a(i%200,i/400)}`
  },
  {
    id: 'absolute-cosine-2',
    name: 'Absolute Cosine Complex',
    description: 'Complex absolute cosine pattern with nested trigonometric functions',
    code: `a=(x,y,k=x/12-12.5,d=abs(cos(k/2)+sin(y/2)*cos(k/5)/2+1))=>point((q=x/4+99+(d+0)*k*(.5+cos(d*2-t+y/8)))*.8*cos(c=y/69-t/8+d/6)+200,q/2*cos(c+d/3+y/69)+200)`,
    setup: `t=0,draw=$=>{t||createCanvas(w=400,w);background(0).stroke(w,46);for(t+=PI/30,i=4e4;i--;)a(i%300,i/300)}`
  }
]

export const getAlgorithmById = (id: string): GenerativeAlgorithm | undefined => {
  return generativeAlgorithms.find(algo => algo.id === id)
}

export const getAlgorithmsByCategory = (category: string): GenerativeAlgorithm[] => {
  // Future: implement categorization
  return generativeAlgorithms
}

export const generateP5Code = (algorithm: GenerativeAlgorithm, params?: any): string => {
  const { code, setup } = algorithm
  const customParams = params || algorithm.params || {}
  
  return `
// ${algorithm.name}
// ${algorithm.description}

${code}
${setup}
  `.trim()
} 