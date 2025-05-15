const IMAGE_CANVAS_TYPES = ["image/webp", "image/png", "image/jpeg"] as const;

export class ImageCanvas {
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	constructor() {
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		const ctx = this.canvas.getContext("2d");
		if (!ctx) {
			throw new Error("2d Context cannot be created for canvas.");
		}
		this.ctx = ctx;
	}

	destroy() {
		this.canvas.remove();
	}

	async drawImage(imageFile: File) {
		const img = new Image();

		const conversion = new Promise((resolve, reject) => {
			img.onload = async () => {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.drawImage(
					img,
					0,
					0,
					this.canvas.width,
					this.canvas.height,
				);
				URL.revokeObjectURL(img.src);
				resolve(null);
			};
		});

		img.src = URL.createObjectURL(imageFile);

		await conversion;
	}

	async getImageUrl(
		type?: (typeof IMAGE_CANVAS_TYPES)[number],
		quality?: number,
	): Promise<null | string> {
		return new Promise((resolve) => {
			this.canvas.toBlob(
				(blob) => {
					if (!blob) {
						resolve(null);
						return;
					}
					resolve(URL.createObjectURL(blob));
				},
				type,
				quality,
			);
		});
	}
}
