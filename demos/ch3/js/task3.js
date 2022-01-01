var canvas = document.getElementById("glcanvas");
var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
var width = canvas.width;
var height = canvas.height;
var num = 1;
initWebGL();
function initWebGL(){
    var VSHADER_SOURCE = 
    `
        attribute vec4 a_p;
        attribute float size;
        void main() {
            gl_Position = a_p;
            gl_PointSize = 3.0;
        }
    `;
    var FSHADER_SOURCE =
    `
        #ifdef GL_ES
        precision mediump float;
        #endif
        uniform vec4 color;
        void main(){
            float d = distance(gl_PointCoord, vec2(0.5,0.5));
            if(d < 0.5){
                gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
            }else{ discard;}
        }
    `;

     //创建一个着色器程序
     var program = gl.createProgram();

     // <!-- 创建顶点着色器 -->
     var vShader = gl.createShader(gl.VERTEX_SHADER);
     // <!-- 创建片元着色器 -->
     var fShader = gl.createShader(gl.FRAGMENT_SHADER);
     // <!-- shader容器与着色器绑定 -->
     gl.shaderSource(vShader, VSHADER_SOURCE);
     gl.shaderSource(fShader, FSHADER_SOURCE);
     // <!-- 将GLSE语言编译成浏览器可用代码 -->
     gl.compileShader(vShader);
     gl.compileShader(fShader);
     // <!-- 将着色器添加到程序上 -->
     gl.attachShader(program, vShader);
     gl.attachShader(program, fShader);
     // <!-- 链接程序，在链接操作执行以后，可以任意修改shader的源代码，
     // 对shader重新编译不会影响整个程序，除非重新链接程序 -->
     gl.linkProgram(program);
     // <!-- 加载并使用链接好的程序 -->
     gl.useProgram(program);
     gl.program = program;

     render();
}

function render(){
    requestAnimationFrame(render);
    num = num -1;
    var data = createPoints(num);
    setPoints(data.positions,data.nums);
}
//创建点
function createPoints(gap) {
    //波动最大幅度 10px;
    var max = 10
    var n = 100;
    var m = 10;
    var arr = [];
    // var size = [];
     //角度转弧度
    var numToDeg=function(num) {
        return  Math.PI*num/ 180;
    };

    for(var i = 0; i < n; i++) {
        for(var j = 0; j < m; j++) {
            var deg = (i*7-j*20+gap);                
            var x = webglX(-(width/2)-200+i*((width+500)/n)+j*20);
            var y = webglY(-(height/2)+Math.sin(numToDeg(deg))*(max+j*3) + j*20);
            var z = -1;
            var item = [x, y, z];
            arr = arr.concat(item);
            // size.push((4-j/4));
        }
    }
    return {
        positions: new Float32Array(arr),
        // size: new Float32Array(size),
        nums: m * n
    }
}

function setPoints(data, num) {
    //1.创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        log('创建缓存区失败。');
        return -1;
    }
    // 2.绑定缓冲区对象，将缓冲区对象绑定目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 3.向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // 4.获取变量存储位置，获取坐标点
    var a_position = gl.getAttribLocation(gl.program, 'a_p');
     // 5.把缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
    // 6.连接缓冲区对象和a_Position变量
    gl.enableVertexAttribArray(a_position);
    //清除屏幕
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制num个点
    gl.drawArrays(gl.POINTS, 0 , num);
}

function webglX (num) {
    return num/(width/2);
};
function webglY (num) {
    return num/(height /2);
}
