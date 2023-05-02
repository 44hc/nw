#ifdef GL_ES
    precision mediump float;
#endif

varying vec4 v_color;
varying vec2 v_texCoords;
uniform sampler2D u_texture;

void main() {
	vec4 texture = texture2D(u_texture, v_texCoords);
	vec3 tinted = v_color.rgb * dot(vec3(0.2125, 0.7154, 0.0721), texture.rgb) * 1.048;
	gl_FragColor = vec4(mix(texture.rgb, tinted, v_color.a), texture.a);
}