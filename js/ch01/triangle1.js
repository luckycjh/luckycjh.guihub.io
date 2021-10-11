"use strict";

var gl;
var points;

window.onload = function init(){

	//获取canvas元素
	var canvas = document.getElementById( "triangle-canvas" );

	//初始化上下文
	gl = WebGLUtils.setupWebGL( canvas );

	//确认WebGL支持性
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// Three Vertices
	var vertices = [
		 0.1,0.0,  0.0,0.0,1.0,
		 0.1,0.9,  0.0,0.0,1.0,
		 1.0,0.9,  0.0,0.0,1.0,
		 1.0,0.0,  0.0,0.0,1.0,

		 -0.5,1.0,    0.0,0.0,1.0,
		 -1.0,-0.0,   1.0,0.0,0.0,
		  0.0,0.0,    0.0,1.0,0.0

	];
	var FSIZE = 4;

	// 设置视口
	gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );

	// 背景颜色
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// 创建、编译和链接着色器
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );

	//应用着色器
	gl.useProgram( program );

	//创建缓区
	var bufferId = gl.createBuffer();

	//绑定缓存区
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

	//通过绑定点向缓冲区绑定数据
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );

	//在着色器中寻找attribute变量的位置
	var vPosition = gl.getAttribLocation( program, "vPosition" );

	//从缓冲区取出数据
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 5*FSIZE, 0);
	gl.enableVertexAttribArray( vPosition );

	var a_Color = gl.getAttribLocation(program,"a_Color");
	gl.vertexAttribPointer( a_Color, 3, gl.FLOAT, false, 5*FSIZE, 2*FSIZE);
	gl.enableVertexAttribArray( a_Color );

	render();
}

function render(){

	//用上面指定的颜色清除缓冲区
	gl.clear( gl.COLOR_BUFFER_BIT );
	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

	//画图,count为画图所顶点次数
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLES,4,3);
	//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
}