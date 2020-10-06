export class TraceColor {
    mainColor: string;
    apiKey: string;
    shades: string[];

    constructor(mainColor: string, apiKey: string) {
        this.mainColor = mainColor;
        this.apiKey = apiKey;
        if (mainColor) {
            this.shades = this.updateTraceShades();
        }
    }

    public updateTraceShades(numberOfShades: number = 5): string[] {
        this.shades = [this.mainColor];
        for (let i = 0; i < numberOfShades; i++) {
            this.shades.push(this.shadeRGBColor(this.mainColor, (0.1 * (i + 1))));
        }
        return this.shades;
    }

    private shadeRGBColor(color: string, percent: number) {
        color = color.replace('rgba', 'rgb');

        const f = color.split(',');
        const t = percent < 0 ? 0 : 255;
        const p = percent < 0 ? percent * -1 : percent;
        const R = parseInt(f[0].slice(4), 10);
        const G = parseInt(f[1], 10);
        const B = parseInt(f[2], 10);
        return 'rgb(' + (Math.round((t - R) * p) + R) + ',' + (Math.round((t - G) * p) + G) + ',' + (Math.round((t - B) * p) + B) + ')';
    }
}
