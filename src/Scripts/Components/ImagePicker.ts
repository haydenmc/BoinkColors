/// <reference path="../Definitions/boink.d.ts" />
/// <reference path="../Data/ColorModel.ts" />

class ImagePicker extends Component {
	private pasteEvent: (ev) => void;
	private canvasClickEvent: (ev) => void;
	
	public attachedCallback(): void {
		super.attachedCallback();
		
		this.pasteEvent = (ev) => {
			var items = ev.clipboardData.items;
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					var blob = items[i].getAsFile();
					var source = window.URL.createObjectURL(blob);
					this.pasteImage(source);
				}
			}
		};
		
		this.canvasClickEvent = (ev) => {
			var canvas = this.shadowRoot.querySelector("canvas");
			var canvasX = canvas.getBoundingClientRect().left;
			var canvasY = canvas.getBoundingClientRect().top;
			var mouseX = ev.clientX;
			var mouseY = ev.clientY;
			this.canvasClick(mouseX - canvasX, mouseY - canvasY);
		};
		
		this.shadowRoot.querySelector("canvas").addEventListener("mousedown", this.canvasClickEvent);
		document.addEventListener("paste", this.pasteEvent);
	}
	
	public pasteImage(source: string): void {
		var canvas = <HTMLCanvasElement>this.shadowRoot.querySelector("canvas");
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		var pastedImage = new Image();
		pastedImage.onload = function() {
			canvas.width = pastedImage.width;
			canvas.height = pastedImage.height;
			canvas.getContext("2d").drawImage(pastedImage, 0, 0);
		};
		pastedImage.src = source;
	}
	
	public canvasClick(x: number, y: number) {
		var canvas = <HTMLCanvasElement>this.shadowRoot.querySelector("canvas");
		var canvasElWidth = canvas.clientWidth;
		var canvasElHeight = canvas.clientHeight;
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		var targetX = (x / canvasElWidth) * canvasWidth;
		var targetY = (y / canvasElHeight) * canvasHeight;
		var canvasContext = canvas.getContext("2d");
		var data = canvasContext.getImageData(targetX, targetY, 1, 1);
		var newColor = new ColorModel();
		newColor.red.value = data.data[0];
		newColor.green.value = data.data[1];
		newColor.blue.value = data.data[2];
		this.dataContext.value = newColor;
	}
}
Component.register("bc-imagepicker", ImagePicker);
