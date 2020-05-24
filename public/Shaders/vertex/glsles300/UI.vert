#version 300 es

in vec4 position;
in vec4 color;
in vec2 textureCoords;

uniform mat4 viewProjMatrix;
uniform sampler2D vTexture;

out vec2 vTextureCoords;

void main() {
  gl_Position = position * viewProjMatrix;
  vTextureCoords = textureCoords;
}
