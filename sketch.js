let amplitude = 100; // Amplitude inicial
let frequencia = 1; // Frequência inicial
let deslocamento = 0; // Deslocamento inicial
let funcaoAtual = "Seno"; // Função inicial
let osciladorEsquerdo, osciladorDireito; // Para som binaural

function setup(){
    createCanvas(800,400); // Tamanho da tela
    textSize(16);
    textAlign(CENTER);

    // Interface de controle
    createP("Use os sliders abaixo para ajustar os parâmetros:");
    createSliderElement("Amplitude",1,200,amplitude, (val)=> amplitude = val);
    createSliderElement("Frequência",0.1,5,frequencia, (val)=> frequencia = val);
    createSliderElement("Deslocamento", -PI, PI, deslocamento, (val)=> deslocamento = val);
    createP("Escolha a função trigonométrica:");
    createSelectElement(["Seno","Cosseno","Tangente"], (val) => funcaoAtual = val);

    // Configurar som binaural
    osciladorEsquerdo = new p5.Oscillator("sine");
    osciladorDireito = new p5.Oscillator("sine");
    osciladorEsquerdo.amp(0.5);
    osciladorDireito.amp(0.5);
    osciladorEsquerdo.start();
    osciladorDireito.start();
}

function draw(){
    background(30); // Cor de fundo
    stroke(255); //Cor da linha
    noFill(); //Sem preenchimento
    translate(0, height/2); // Centraliza no meio da tela

    beginShape();
    for(let x = 0; x < width; x++){
        let y = calcularY(funcaoAtual, x); // Função trigonometrica
        vertex(x, -y); // Inverter y para coordenada "cartesianas"
    }
    endShape();
    drawAxes(); // Desenhar eixos

    // Ajustar o som com base na frequência , na amplitude e na função trigonometrica
    let baseFreq = map(frequencia, 0.1, 5, 200, 800); // Frequência do som (Hz) 
    let baseAmp = map(amplitude, 1, 200, 0.1, 0.8); // Volume do som
    if(funcaoAtual === "Seno"){
        osciladorEsquerdo.freq(baseFreq);
        osciladorDireito.freq(baseFreq + 5); // Diferença binaural
        osciladorEsquerdo.amp(baseAmp);
        osciladorDireito.amp(baseAmp);
        osciladorEsquerdo.setType("sine");
        osciladorDireito.setType("sine");
    } else if ( funcaoAtual === "Cosseno"){
        osciladorEsquerdo.freq(baseFreq);
        osciladorDireito.freq(baseFreq - 5); // Diferença binaural invertida
        osciladorEsquerdo.setType("triangle");
        osciladorDireito.setType("triangle");
    } else if ( funcaoAtual === "Tangente"){
        osciladorEsquerdo.freq(baseFreq* 2);
        osciladorDireito.freq(baseFreq * 2 + 10); // Frenquência mais aguda para tangente
        osciladorEsquerdo.setType("square");
        osciladorDireito.setType("square");
    }
}

// Função para criar sliders
function createSliderElement(label, min, max, start, callback){
    createP(label)
    let slider = createSlider(min, max, start, 0.1);
    slider.input(() => callback(slider.value()));
}

// Função para criar selects
function createSelectElement(options, callback){
    let select = createSelect()
    options.forEach( option => select.option(option));
    select.changed(() => callback(select.value()));
}

// Calcular y com base na função escolhida
function calcularY(funcao, x){
    let valorX = frequencia * (x / 50) + deslocamento;
    if( funcao === "Seno") return amplitude * sin(valorX);
    if( funcao === "Cosseno") return amplitude * cos(valorX);
    if( funcao === "Tangente") return amplitude * tan(valorX);
}
// Desenhar os eixos cartesianos
function drawAxes(){
    stroke(150);
    line(0,0,width,0); // Eixo X
    line(width/2,-height/2,width/2,height/2); // Eixo Y
}
