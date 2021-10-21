var __coupon = false, __coupon_expires = 30 * 1000 * 60 * 60 * 24, __cookies = {
	Set: function (n, v, time, path) {
		var e = '', d;
		if (time) {
			d = new Date();
			d.setTime(d.getTime() + (time));
			e = "; expires=" + d.toGMTString();
		}
		if (!path) path = "/";
		document.cookie = n + "=" + v + e + "; path="+path;
	},
	Get: function (n) {
		var match = n + "=", c = '', ca = document.cookie.split(';'), i;
		for (i = 0; i < ca.length; i++) {
			c=String(ca[i]).trim()
			if (c.indexOf(match) === 0) {
				return c.substring(match.length, c.length);
			}
		}
		return null;
	},
	Unset: function (n) {
		this.Set(n, "", -1);
	},
	Parse: function() {
		var str = window.location.search;
		var objURL = {};
		str.replace( new RegExp("([^?=&]+)(=([^&]*))?", "g"),function($0, $1, $2, $3){ objURL[$1] = $3; });
		objURL.count = function(){
			var count = 0;
			for(var prop in this) {
				if(this.hasOwnProperty(prop))
					count = count + 1;
			}
			return count - 1;
		};
		return objURL;
	},
	ApplyCode: function(code){
		if (code) {
			$('#discount\\.code').val(code).blur();
			$('#form_discount_add button').click();
		}
	},
};
if(window.location.search){
	var __search = window.location.search;
	(__search.indexOf('coupon') > -1) ? __coupon = true : __coupon = false;
	if(__coupon){
		var __parse_url = __cookies.Parse(window.location.href);
		var __get_coupon = __parse_url.coupon.toUpperCase();
		__cookies.Set("__coupon", __get_coupon,__coupon_expires);
	}
}
var __get_coupon = (__cookies.Get('__coupon') != null) ? __cookies.Get('__coupon') : null;
if(__get_coupon != null){
	var downcase_coupon = __get_coupon.toLowerCase();
	if(window.location.href.indexOf('checkouts') == -1 && window.location.href.indexOf('thank_you') == -1){
		if(!window.active_coupon || window.active_coupon == undefined){
			localStorage.setItem("__temp_coupon",__cookies.Get("__coupon"));
			__cookies.Unset("__coupon");
		}
	}
	if(window.location.href.indexOf('checkouts') != -1 && window.location.href.indexOf('thank_you') == -1){
		function __apply_coupon(){
			var __has_apply = false, __length_coupon, temp_coupon;
			if($(window).width() < 999){
				__length_coupon = $('.content.content-second .payment-lines .applied-reduction-code-information').length;
				if(__length_coupon > 0){
					temp_coupon = $('.content.content-second .payment-lines .applied-reduction-code-information').html().trim();
				}
			}
			else{
				__length_coupon = $('.content:not(.content-second) .payment-lines .applied-reduction-code-information').length;
				if(__length_coupon > 0){
					temp_coupon = $('.content:not(.content-second) .payment-lines .applied-reduction-code-information').html().trim();
				}
			}
			if(temp_coupon == __get_coupon){
				__has_apply = true;	
			}
			if($('.__coupon_'+__get_coupon).length == 0){
				var __html_coupon = '';
				__html_coupon += '<div class="__action_apply __coupon_'+__get_coupon+'" style="margin: 15px 0 0 0;">';
				__html_coupon += '<div class="__apply_coupon">';
				__html_coupon += '<div class="__title_coupon">Mã khuyến mãi của bạn:</div>';
				if(__has_apply){
					__html_coupon += '<div class="__value_coupon" style="font-weight:bold;cursor: pointer;color:black;display: inline-block;background: #dedddd;padding: 10px;border-radius: 4px;margin: 10px 0 0 0;text-transform: uppercase;pointer-events: none;">'+__get_coupon+'</div>';
				}
				else{
					__html_coupon += '<div class="__value_coupon" style="font-weight:bold;cursor: pointer;color:black;display: inline-block;background: #eaeaea;padding: 10px;border-radius: 4px;margin: 10px 0 0 0;text-transform: uppercase;">'+__get_coupon+'</div>';
				}
				__html_coupon += '</div>';
				__html_coupon += '</div>';
				if($(window).width() < 999){
					$('.content.content-second #form_discount_add').append(__html_coupon);
				}
				else{
					$('.content:not(.content-second) #form_discount_add').append(__html_coupon);
				}
			}
		}
		$(document).on('click', '.__value_coupon', function(){
			var coupon = $(this).html().trim();
			__cookies.ApplyCode(coupon);
		});
		__apply_coupon();
		$(document).ajaxComplete(function( event, request, settings ) {
			__apply_coupon();
		});
	}
	if(window.location.href.indexOf('checkouts') != -1 && window.location.href.indexOf('thank_you') != -1){
		var __length_coupon = $('.applied-reduction-code-information').length;
		if(__length_coupon > 0){
			var __get_coupon_apply = $('.applied-reduction-code-information').html().trim();
			if(__get_coupon == __get_coupon_apply){
				__cookies.Unset('__coupon');
			}
		}
	}
}
else{
	if(window.location.href.indexOf('checkouts') != -1 && window.location.href.indexOf('thank_you') == -1){
		var temp_local_coupon = localStorage.getItem("__temp_coupon");
		if(temp_local_coupon != null){
			var __length_coupon,temp_coupon;
			if($(window).width() < 999){
				__length_coupon = $('.content.content-second .payment-lines .applied-reduction-code-information').length;
				if(__length_coupon > 0){
					temp_coupon = $('.content.content-second .payment-lines .applied-reduction-code-information').html().trim();
				}
			}
			else{
				__length_coupon = $('.content:not(.content-second) .payment-lines .applied-reduction-code-information').length;
				if(__length_coupon > 0){
					temp_coupon = $('.content:not(.content-second) .payment-lines .applied-reduction-code-information').html().trim();
				}
			}
			if(temp_coupon == temp_local_coupon){
				$('button.applied-reduction-code-clear-button.icon.icon-clear').click();
				localStorage.removeItem("__temp_coupon");
			}
		}
	}
}
