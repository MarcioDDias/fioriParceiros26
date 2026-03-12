/*global QUnit*/

sap.ui.define([
	"fiori/z99bp/controller/Parceiros.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Parceiros Controller");

	QUnit.test("I should test the Parceiros controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
