/*!
  \file
  \brief Perona – Malik Anisotropic Filter
*/

#define PM_RED(rgb)     (( (rgb) >> 16) & 0xffu)
#define PM_GREEN(rgb)   (( (rgb) >> 8 ) & 0xffu)
#define PM_BLUE(rgb)    (  (rgb)        & 0xffu)
#define PM_RGB(r, g, b) (( (r) & 0xffu) << 16) | (( (g) & 0xffu) << 8) | ( (b) & 0xffu)

/**
 * \brief Gets the value of a specific color channel from an RGB value.
 * \param rgb The RGB value.
 * \param channel The color channel (0 for red, 1 for green, 2 for blue).
 * \return The value of the specified color channel.
 */
int getChannel(uint rgb, int channel)
{
    switch(channel) {
        case 0:
            return PM_RED(rgb);
        case 1:
            return PM_GREEN(rgb);
        case 2:
            return PM_BLUE(rgb);
    }
    return 0;
}

float quadric(int norm, float thresh)
{
    return 1.0f / (1.0f + norm * norm / (thresh * thresh));
}

float exponential(int norm, float thresh)
{
    return exp(- norm * norm / (thresh * thresh));
}

__kernel void pm(__global uint *bits,
                 float thresh,
                 int  eval_func,
                 float lambda,
                 int w,
                 int h,
                 int offsetX,
                 int offsetY)
{
    const int x = offsetX + get_global_id(0);
    const int y = offsetY + get_global_id(1);

    if(x < w && y < h) {
        int p, deltaW, deltaE, deltaS, deltaN;
        float cN, cS, cE, cW;
        int rgb[3] = {0};
        for(int ch = 0; ch < 3; ++ch) {
            // p = getChannel(bits[x + y * w], ch);
            p = get
            deltaW = getChannel(bits[x + (y-1) * w], ch) - p;
            deltaE = getChannel(bits[x + (y+1) * w], ch) - p;
            deltaS = getChannel(bits[x+1 + y * w],   ch) - p;
            deltaN = getChannel(bits[x-1 + y * w],   ch) - p;
            if(eval_func) {
                cN = exponential(abs(deltaN), thresh);
                cS = exponential(abs(deltaS), thresh);
                cE = exponential(abs(deltaE), thresh);
                cW = exponential(abs(deltaW), thresh);
            } else {
                cN = quadric(abs(deltaN), thresh);
                cS = quadric(abs(deltaS), thresh);
                cE = quadric(abs(deltaE), thresh);
                cW = quadric(abs(deltaW), thresh);
            }
			rgb[ch] = (int)(p + lambda * (cN * deltaN + cS * deltaS +
                                          cE * deltaE + cW * deltaW));
        }
        bits[x + y * w] = PM_RGB(rgb[0], rgb[1], rgb[2]);
    }
}