var plcapp = plcapp || {};

define([
	'thorax',
	'models/lifecycle/payment-info-model'
	], function (Thorax, PaymentInfoModel) {

	plcapp.PaymentTxnCollection = Thorax.Collection.extend({
	    model: plcapp.PaymentInfoModel,
	    url: '/data/paymentinfo.json'   //NEW

	});	
	
});