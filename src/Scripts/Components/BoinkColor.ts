/// <reference path="../Definitions/boink.d.ts" />
/// <reference path="../Data/DataModel.ts" />

class BoinkColor extends Application {
	public createdCallback() {
		super.createdCallback();
		this.dataContext.value = new DataModel();
	}
}
Component.register("bc-application", BoinkColor);
