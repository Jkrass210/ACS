var KladrJsObj = {
	kladrdivid:                "ipolkladrform", /* KLADR form div */
	container:                 false,
	city:                      false,
	street:                    false,
	building:                  false,
	room:                      false,
	noreload:                  false,
	arAdrSeq:                  ['region', 'city', 'street', 'building'],	

	ipolkladrfname:            false, /* Address field name */
	ipolkladrlocation:         false, /* Location field name */
	roomnum:                   false,
	 
	lastobject:                {}, /* KLADR object will be stored there */
	
	map:                       null,
	map_created:               false,
	placemark:                 null,
	
	kladrtownid:               false,
	
	lastLocationCode:          false, /* Bitrix location code */
	profile:                   {isUsed: false, current: false, isChanged: false}, /* User profile */
	
	fancyForm:                 false,	
	newVersionTemplate:        false,
	zipPropId:                 false, /* Index prop Id */
	locPropId:                 false, /* Location prop Id */
	locations_not_rus_checked: false,
	saveLoc:                   false, /* Debug purpose only */
	kladr_city_obj:            false, /* KLADR city */
	smart_locid:               'SAdr_city', /* KLADR location input */

	/*
	Custom events:
		onMapCreated - RunForm
	*/

	/**
	 * Prepare
	 * @param Klobj
	 */
	FormKladr: function(Klobj){
		var ajax = false;
		var notRussia;
		var adr = "";

		if (Klobj && !$.isEmptyObject(Klobj) && Klobj.ajax)
			ajax = Klobj.ajax;

		if (!$.isEmptyObject(Klobj) && !$.isEmptyObject(Klobj.kladr)) {
			notRussia = Klobj.kladr.NotRussia;
		} else {
			notRussia = $('.NotRussia:last').val();
			$('.NotRussia:last').remove();
		}
		
		if (notRussia == true) {
			KladrJsObj.FuckKladr();
			return;
		}

		/* Old template */
		if (typeof(Klobj.kladr) == 'undefined') {
			Klobj.kladr = {'kltobl':{}};
		}

		if ($('.kltobl:last').length && $.isEmptyObject(Klobj.kladr.kltobl)) {
			var t = $('.kltobl:last').text();
			Klobj.kladr.kltobl = t ? JSON.parse(t) : {};
			$('.kltobl:last').remove();
		} else {
			if (typeof(Klobj.kladr.kltobl) == 'string' && Klobj.kladr.kltobl != '')
				Klobj.kladr.kltobl = JSON.parse(Klobj.kladr.kltobl);
		}
		/* Now city in Klobj.kladr.kltobl */
		
		if(!KladrJsObj.kladr_city_obj && !$.isEmptyObject(Klobj.kladr.kltobl))
			KladrJsObj.kladr_city_obj = Klobj.kladr.kltobl;
		
		/* Make KLADR for Klobj.kladr.kltobl */
		/* Deal with address props */
		KladrJsObj.ipolkladrfname = false;
		KladrJsObj.prop_forms = new Array();
		if (typeof(KladrSettings.arNames) != "undefined") {
			KladrSettings.arNames.forEach(function(entry){
				if ($('[name ='+entry+']').length > 0)
					KladrJsObj.prop_forms[KladrJsObj.prop_forms.length] = entry;
				
			});
			KladrJsObj.ipolkladrfname = KladrJsObj.prop_forms.shift();
		} else {
			console.warn('ipol.kladr error: no address fields found');
		}

		if (typeof(KladrJsObj.ipolkladrfname) == "undefined" || KladrJsObj.ipolkladrfname == false) {
			console.warn('ipol.kladr error: ipolkladrfname not found');
			return;
		}

		KladrJsObj.ipolkladrlocation = false;

		/* Deal with ZIP */
		if (typeof(Klobj.kladr.kltobl.zip) != "undefined" && KladrJsObj.zipPropId) {
			if (!$.isEmptyObject(KladrJsObj.lastobject.city) && !$.isEmptyObject(Klobj.kladr.kltobl)) {
				/* If city changes */
				if (KladrJsObj.lastobject.city.id != Klobj.kladr.kltobl.id) {
					KladrJsObj.updateZIP(Klobj.kladr.kltobl.zip);
				}
			} else {
				/* Last object unknown */
				KladrJsObj.updateZIP(Klobj.kladr.kltobl.zip);
			}
		}

		/* Restore last object */
		if (!$.isEmptyObject(Klobj.kladr) && !$.isEmptyObject(Klobj.kladr.kltobl)) {
			var obj = Klobj.kladr.kltobl;

			KladrJsObj.UnBlockAdrProps();

			/* New page or city changes */
			if ($.isEmptyObject(KladrJsObj.lastobject) || obj.id != KladrJsObj.kladrtownid) {
				KladrJsObj.lastobject = {};
				KladrJsObj.lastobject[obj.contentType] = obj;
				KladrJsObj.roomnum = '';
								
				/* Do not delete the address, it could be restored from the profile of the previous order */
				if ((!KladrJsObj.profile.isUsed && KladrJsObj.kladrtownid) || (KladrJsObj.profile.isUsed && !KladrJsObj.profile.isChanged))
				/* if (KladrJsObj.kladrtownid) */
					KladrJsObj.CleanAdrProps();
				
				KladrJsObj.kladrtownid = obj.id;
				KladrJsObj.contentType = obj.contentType;
			}
		} else {
			if ($.isEmptyObject(KladrJsObj.lastobject) && KladrSettings.notShowForm) {
				KladrJsObj.SetAdrProp(KladrJsObj.ipolkladrfname, BX.message('RunFormnoktoblattr'));
				KladrJsObj.BlockAdrProps();
				return;
			}
		}

		/* Deal with address */
		adr = $('[name =' + KladrJsObj.ipolkladrfname + ']').val();
		/* Checks if address input filled with default bitrix placeholder instead of real address */
		if (adr == BX.message('RunFormnoktoblattr')) {
			adr = '';
			$('[name ='+KladrJsObj.ipolkladrfname+']').val('');
		}
		if (adr) {
			/* Do Change address button if address filled */
			KladrJsObj.prop_forms.forEach(function(entry){
				adr += ', ' + $('[name =' + entry + ']').val();
			});
			KladrJsObj.BlockAdrProps();
			$('[name =' + KladrJsObj.ipolkladrfname + ']').after('<br><a class="nobasemessage" href="javascript:KladrJsObj.nobasemessage();">' + BX.message('CHANGEADR') + '</a><br>');
		} else {
			if (typeof($.fias) == "object") {
				KladrJsObj.PrintForm();
				KladrJsObj.RunForm();
			}
		}
	},

	/**
	 * Makes and insert KLADR address selection form
	 */
	PrintForm: function(){
		var inpclass; /* Class for street */
		var disabled;
		var formK;
		var oncl = '';

		KladrJsObj.map_created = false;

		inpclass = KladrJsObj.contentType == 'city' ? "top" : "middleinput";

		if (KladrSettings.MakeFancy)
			oncl = 'javascript:KladrJsObj.FancyForm();';

		formK = '<div id="' + KladrJsObj.kladrdivid + '" class="ipolkladrform">';
		formK += '<div class="fancyback">';
		formK += '</div>';
		
		formK += '<div class="fancyform">';
		formK += '<form class="js-form-address" onclick="' + oncl + '">';
				
		/* City */
		if (KladrJsObj.contentType != 'city') {
			formK += '<div class="top"><input name="city" type="text" placeholder="' + BX.message('TAPETOWN') + '"></div>';
			disabled = 'disabled="disabled"';

			formK += '<div class="alert alert-danger kladr-address-error"></div>';
		}
				
		/* Street */
		if (KladrJsObj.lastobject.street)
			disabled = '';
		if (KladrJsObj.prop_forms.length == 3)
			disabled += ' name="' + KladrJsObj.ipolkladrfname + '" id="' + KladrJsObj.ipolkladrfname + '" ';
		formK += '<div class="' + inpclass + '"><input name="street" type="text" placeholder="' + BX.message('TAPESTREET') + '" '+ disabled +'></div>';
				
		/* House */
		disabled = 'disabled="disabled"';
		if (KladrJsObj.lastobject.building)
			disabled = '';
		if (KladrJsObj.prop_forms.length == 3)
			disabled += ' name="' + KladrJsObj.prop_forms[0] + '" id="' + KladrJsObj.prop_forms[0] + '" ';
		formK += '<div class="bottom"><input name="building" type="hidden" placeholder="' + BX.message('TAPENUMPER') + '" ' + disabled + '>';

		/* Flat */
		disabled = 'disabled="disabled"';
		if (KladrJsObj.lastobject.room)
			disabled = '';
		if (KladrJsObj.prop_forms.length == 3)
			disabled += ' name="'+KladrJsObj.prop_forms[2] + '" id="' + KladrJsObj.prop_forms[2] + '" ';
		formK += '<input class="room placeholdered" type="hidden" name="room" disabled="disabled" value="' + BX.message('TAPEROOM') + '"></div>';
		formK += '</form>';

		/* Map */
		if (KladrSettings.ShowMap)
			formK += '<div id="map" class="panel-map"></div>';
		/* Address string */
		if (KladrSettings.ShowAddr) {
			formK += '<div class="addition">';
			formK += '<div class="block">';
			formK += '<p id="address" class="value"></p>';
			formK += '</div>';
			formK += '<div class="block" style="display:none;">';
			formK += '<p class="title">Selected object</p>';
			formK += '<ul class="js-log">';
			formK += '<li id="id" style="display: none;"><span class="name">ID</span> <span class="value"></span></li>';
			formK += '<li id="zip" style="display: none;"><span class="name">ZIP</span> <span class="value"></span></li>';
			formK += '<li id="name" style="display: none;"><span class="name">Name</span> <span class="value"></span></li>';
			formK += '<li id="type" style="display: none;"><span class="name">Type</span> <span class="value"></span></li>';
			formK += '<li id="typeShort" style="display: none;"><span class="name">Type short</span> <span class="value"></span></li>';
			formK += '<li id="contentType" style="display: none;"><span class="name">Content type</span> <span class="value"></span></li>';
			formK += '<li id="okato" style="display: none;"><span class="name">OKATO</span> <span class="value"></span></li>';
			formK += '</ul>';
			formK += '</div>';
			formK += '</div>';
		}

		if (KladrSettings.MakeFancy)
			formK += '<div class="unfancybutton" onclick="KladrJsObj.UnFancyForm()">' + BX.message('SAVEADR') + '</div>';

		formK += '</div>';
		formK += '</div>';
		formK += '<input name="ipolkladrnewcity" class="ipolkladrnewcity" type="hidden">';
		formK += '<input name="ipolkladrnewregion" class="ipolkladrnewregion" type="hidden">';
		formK += '<input name="ipolkladrlocation" class="ipolkladrlocation" type="hidden">';

		$('[name ='+KladrJsObj.ipolkladrfname+']').after(formK);
		KladrJsObj.HideAdrProps();


		$(".js-form-address").submit(function (e) {
			e.preventDefault();
		});
	},

	/**
	 * Init KLADR address selection form, configure $.fias, makes Ymap
	 */
	RunForm: function(){
		KladrJsObj.container = $('#'+KladrJsObj.kladrdivid);
		if (!KladrJsObj.container.length) {
			console.warn('kladrdivid not found');
			return;
		}

		KladrJsObj.city     = KladrJsObj.container.find('[name="city"]');
		KladrJsObj.street   = KladrJsObj.container.find('[name="street"]');
		KladrJsObj.building = KladrJsObj.container.find('[name="street"]');
		KladrJsObj.room     = KladrJsObj.container.find('[name="room"]');

		/* Configuring $.fias plugin */
		$.fias.setDefault({
			parentInput: '.js-form-address',
			verify:      true,
			token:       KladrSettings.kladripoltoken,
			oneString: true,

			labelFormat: function(obj, query){
				var label = '';
				var name = obj.name.toLowerCase();

				query = query.name.toLowerCase();

				var start = name.indexOf(query);
				start = start > 0 ? start : 0;

				if (obj.typeShort) {
					label += obj.typeShort + '. ';
				}

				if (query.length < obj.name.length) {
					label += obj.name.substr(0, start);
					label += '<strong>' + obj.name.substr(start, query.length) + '</strong>';
					label += obj.name.substr(start + query.length, obj.name.length - query.length - start);
				} else {
					label += '<strong>' + obj.name + '</strong>';
				}

				if (obj.parents) {
					for (var k = obj.parents.length - 1; k > -1; k--) {
						var parent = obj.parents[k];
						if (parent.name) {
							if (label)
								label += '<small>, </small>';
							label += '<small>' + parent.name + ' ' + parent.typeShort + '.</small>';
						}
					}
				}

				return label;
			},

			change: function(obj){
				if (obj) {
					$.fias.getAddress('.js-form-address', function(objs){
						$.extend(KladrJsObj.lastobject, objs);
					});

					if (obj.contentType == $.fias.type.city) {
						if (!KladrJsObj.noreload && KladrSettings.hideLocation) {
							/* Some commented elder code was there - @see Git history */
						} else {
							KladrJsObj.street.removeAttr("disabled");
						}
					}

					switch (obj.contentType) {
						case $.fias.type.city:
							KladrJsObj.street.removeAttr("disabled");
							break;
						case $.fias.type.street:
							KladrJsObj.building.removeAttr("disabled");
							break;
						case $.fias.type.building:
							KladrJsObj.room.removeAttr("disabled");
							break;
					}

					setLabel($(this), obj.type);
				}

				KladrJsObj.log(obj);
				KladrJsObj.addressUpdate();
				KladrJsObj.mapUpdate();
			},

			check: function(obj){
				switch ($(this).attr("name")) {
					case $.fias.type.city:
						if (!obj)
							$(this).val('');
						break;
					case $.fias.type.street:
						KladrJsObj.building.removeAttr("disabled");
						break;
					case $.fias.type.building:
						KladrJsObj.room.removeAttr("disabled");
						break;
				}

				if (!obj)
					KladrJsObj.addressUpdate();
			},

			checkBefore: function(){
				var $input = $(this);

				if (!$.trim($input.val())) {
					KladrJsObj.log(null);
					KladrJsObj.addressUpdate();
					KladrJsObj.mapUpdate();
					return false;
				}
			}
		});

		/* Init form */
		if (KladrJsObj.city)
			KladrJsObj.city.fias({'type': $.fias.type.city});

		if (KladrJsObj.contentType == 'region')
			KladrJsObj.city.fias({'parentType': 'region', 'parentId': KladrJsObj.kladrtownid});

		KladrJsObj.street.fias('type', $.fias.type.street);

		if (KladrJsObj.contentType == 'city')
			KladrJsObj.street.fias({'parentType': 'city', 'parentId': KladrJsObj.kladrtownid});

		KladrJsObj.building.fias('type', $.fias.type.building);

		KladrJsObj.city.fias('withParents', true);
		KladrJsObj.street.fias('withParents', true);

		/* Ymap */
		if (KladrSettings.ShowMap && !KladrJsObj.map_created) {
			ymaps.ready(function(){
				if (KladrJsObj.map_created)
					return;
				KladrJsObj.map_created = true;

				KladrJsObj.map = new ymaps.Map('map', {
					center: [55.76, 37.64],
					zoom: 11,
					controls: [],
				});

				KladrJsObj.map.controls.add('zoomControl', {
					position: {
						right: 10,
						top: 10
					}
				});

				/* Only creation */
				if (!KladrJsObj.placemark) {
					KladrJsObj.placemark = new ymaps.Placemark([55.76, 37.64], {}, {});
				}

				KladrJsObj.setFromDefaultObj();

				/* Event onMapCreated */
				if (typeof (KladrSettings.handlers.onMapCreated) != 'undefined' && KladrSettings.handlers.onMapCreated.length > 0) {
					KladrJsObj.executeFunctionByName(KladrSettings.handlers.onMapCreated, window);
				}
			});
		} else {
			KladrJsObj.setFromDefaultObj();
		}

		function setLabel($input, text){
			text = text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
			$input.parent().find('label').text(text);
		}

		/* Deal with flat number */
		KladrJsObj.room.focusout(function(){
			KladrJsObj.roomnum = KladrJsObj.room.val();
			if (KladrJsObj.roomnum && KladrJsObj.roomnum != BX.message('TAPEROOM')) {
				KladrJsObj.addressUpdate();
			} else {
				KladrJsObj.room.val(BX.message('TAPEROOM'));
				KladrJsObj.room.addClass('placeholdered');
			}
		});

		KladrJsObj.room.focusin(function(){
			if (KladrJsObj.room.val() == BX.message('TAPEROOM')) {
				KladrJsObj.room.val('');
				KladrJsObj.room.removeClass('placeholdered');
			}
		});
	},

	/**
	 * Logging to hidden HTML fields
	 * @param obj
	 */
	log: function(obj){
		var log, i;

		$('.js-log li').hide();

		for (i in obj) {
			log = $('#' + i);
			if (log.length) {
				log.find('.value').text(obj[i]);
				log.show();
			}
		}
	},

	/**
	 * Updates Ymap data
	 */
	mapUpdate: function(){
		if (!KladrSettings.ShowMap)
			return;

		var zoom    = 2;
		var address = $.fias.getAddress('.js-form-address', function(objs){
			var result = '';

			zoom = 7;
			objs = $.extend({}, KladrJsObj.lastobject, objs);

			if (!objs['city'] && KladrJsObj.kladr_city_obj)
				objs['city'] = KladrJsObj.kladr_city_obj;

			KladrJsObj.arAdrSeq.forEach(function(item, i, arr){
				if (!$.isEmptyObject(objs[item])) {
					obj = objs[item];

					var name = '';
					var cityregion = '';
					var type = '';

					if ($.type(obj) === 'object') {
						name = obj.name;
						type = ' ' + obj.type;

						switch (obj.contentType) {
							case $.fias.type.city:
								zoom = 10;
								break;
							case $.fias.type.street:
								zoom = 13;
								break;
							case $.fias.type.building:
								zoom = 16;
								break;
						}
					} else {
						name = obj;
					}

					if (obj.contentType == $.fias.type.city && !$.isEmptyObject(obj.parents))
						cityregion = obj.parents[0].typeShort + '. ' + obj.parents[0].name;

					if (result)
						result += ', ';
					if (cityregion)
						result += cityregion + ', ';
					result += type + ' ' + name;
				}
			});

			return result;
		});

		if (!address) {
			address = BX.message('RF');
			zoom = 2;
		}

		if (address && KladrJsObj.map_created) {
			var geocode = ymaps.geocode(address);
			geocode.then(function(res){
				KladrJsObj.map.geoObjects.each(function(geoObject){
					if (geoObject.geometry.getType() == 'Point') {
						KladrJsObj.map.geoObjects.remove(geoObject);
					}
				});

				var coords = res.geoObjects.get(0).geometry.getCoordinates();

				if (!KladrJsObj.placemark)
					KladrJsObj.placemark = new ymaps.Placemark(coords, {}, {});
				else
					KladrJsObj.placemark.geometry.setCoordinates(coords);

				KladrJsObj.placemark.options.set("draggable", true);

				KladrJsObj.placemark.events.add('dragend', function(e){
					var cord = e.get('target').geometry.getCoordinates();
					ymaps.geocode(cord).then(function(res) {
						var data = res.geoObjects.get(0).properties.getAll();
						$(".js-form-address input[name='street']").val(data.text);
						KladrJsObj.addressUpdate();
						$('#address').text(data.text);
					});
				});

				KladrJsObj.map.geoObjects.add(KladrJsObj.placemark);
				KladrJsObj.map.setCenter(coords, zoom);
			});
		}
	},

	/**
	 * Updates address fields
	 */
	addressUpdate: function(){
		var address = $.fias.getAddress('.js-form-address', function(objs){
			var result = '',
				zip = '';

			zoom = 7;
			objs = $.extend({}, KladrJsObj.lastobject, objs);

			if (!objs['city'] && KladrJsObj.kladr_city_obj)
				objs['city'] = KladrJsObj.kladr_city_obj;

			if (Object.keys(objs).length <= 1)
				return '';

			KladrJsObj.arAdrSeq.forEach(function(item, i, arr){
				if (!$.isEmptyObject(objs[item])) {
					obj = objs[item];

					var name = '';
					var cityregion = '';
					var type = '';

					if ($.type(obj) === 'object') {
						name = obj.name;
						type = ' ' + obj.typeShort + '.';
						if (obj.zip)
							zip = obj.zip;

						if (!KladrSettings.dontAddRegionToAddr) {
							if (obj.contentType == $.fias.type.city && !$.isEmptyObject(obj.parents) && obj.parents[0].type != BX.message('town')) {
								var arrP = [];
								for (i in obj.parents) {
									arrP[i] = obj.parents[i].typeShort + '. ' + obj.parents[i].name;
								}
								cityregion = arrP.join(", ");
							}
						}
					} else {
						name = obj;
					}

					if (result)
						result += ', ';
					if (cityregion)
						result += cityregion + ', ';
					result += type + ' ' + name;
				}
			});

			if (zip) {
				if (!KladrSettings.dontAddZipToAddr)
					result = zip + ', ' + result;
				KladrJsObj.updateZIP(zip);
			}

			if (KladrJsObj.roomnum)
				result += ', ' + BX.message('kv') + KladrJsObj.roomnum;

			return result;
		});

		KladrJsObj.WriteAdr(address);
		$('#address').text(address);
	},

	setFromDefaultObj: function(){
		if (!$.isEmptyObject(KladrJsObj.lastobject)) {
			$.each(KladrJsObj.lastobject, function(i, obj){
				if (typeof(obj) == 'string') {
					KladrJsObj["street"].val(obj);
				}
			});

			KladrJsObj.noreload = true;
			$.fias.setValues(KladrJsObj.lastobject, '#'+KladrJsObj.kladrdivid);
			KladrJsObj.noreload = false;

			KladrJsObj.mapUpdate();
			KladrJsObj.addressUpdate();

			if (KladrJsObj.roomnum)
				KladrJsObj.room.val(KladrJsObj.roomnum);
		} else {
			KladrJsObj.mapUpdate();
			KladrJsObj.addressUpdate();
		}
	},

	HideAdrProps: function(){
		$.each(KladrJsObj.prop_forms, function(i, obj){
			$('[data-property-id-row=' + obj.substr(11) + ']').hide();
		});
		$('[name =' + KladrJsObj.ipolkladrfname + ']').hide();
		$('[data-property-id-row=' + KladrJsObj.ipolkladrfname.substr(11) + ']').find('.label').text(BX.message('IPOL_KLADR_JS_LBL_ADDRESS'));
	},

	ShowAdrProps: function(){
		if (typeof(KladrJsObj.prop_forms) != 'undefined' && KladrJsObj.prop_forms.length) {
			$.each(KladrJsObj.prop_forms, function(i, obj){
				$('[data-property-id-row=' + obj.substr(11) + ']').show();
			});
		}
		if (KladrJsObj.ipolkladrfname) {
			$('[name =' + KladrJsObj.ipolkladrfname + ']').show();
			$('[data-property-id-row=' + KladrJsObj.ipolkladrfname.substr(11) + ']').find('.label').text(BX.message('IPOL_KLADR_JS_LBL_STREET'));
		}
	},

	BlockAdrProps: function(){
		var a;
		a = $.merge([], KladrJsObj.prop_forms);
		a = $.merge(a, Array(KladrJsObj.ipolkladrfname));
		$.each(a, function(i, obj){
			$('[name =' + obj + ']').attr("readonly", "readonly");
		});
	},

	UnBlockAdrProps: function(){
		var a = [];
		if (typeof(KladrJsObj.ipolkladrfname) != 'undefined' && KladrJsObj.ipolkladrfname)
			a = $.merge(a, Array(KladrJsObj.ipolkladrfname));
		if (typeof(KladrJsObj.prop_forms) != 'undefined' && KladrJsObj.prop_forms.length)
			a = $.merge(a, KladrJsObj.prop_forms);
		if (a.length) {
			$.each(a, function(i, obj){
				if ($('[name =' + obj + ']').attr("readonly") == 'readonly')
					$('[name =' + obj + ']').removeAttr("readonly");
			});
		}
	},

	CleanAdrProps: function(){
		var a;
		var allProps;
		a = $.merge([], KladrJsObj.prop_forms);
		allProps = $.merge(a, Array(KladrJsObj.ipolkladrfname));
		$.each(allProps, function(i, obj){
			KladrJsObj.SetAdrProp(obj, '');
		});
	},

	SetAdrProp: function(prop,val){
		if ($('textarea[name =' + prop + ']').length) {
			$('textarea[name =' + prop + ']').text(val);
			$('textarea[name =' + prop + ']').val(val);
		}
		if ($('input[name = ' + prop + ']').length) {
			$('input[name =' + prop + ']').val(val);
		}
	},

	WriteAdr: function(address){
		var adr;
		if (KladrJsObj.prop_forms.length > 0) {
			adr = address.split(',');
			if (typeof(adr[2]) != 'undefined') {
				KladrJsObj.SetAdrProp(KladrJsObj.ipolkladrfname, adr[2]);
			}
			if (typeof(adr[3]) != 'undefined') {
				KladrJsObj.SetAdrProp(KladrJsObj.prop_forms[0], adr[3]);
			}
			if (typeof(adr[4]) != 'undefined') {
				KladrJsObj.SetAdrProp(KladrJsObj.prop_forms[1], adr[4]);
			}
		} else {
			KladrJsObj.SetAdrProp(KladrJsObj.ipolkladrfname, address);
		}
	},

	FancyForm: function(){
		if (!KladrJsObj.fancyForm) {
			$('.fancyback').fadeIn();
			$('.addition').addClass('fancyadd');
			$('.unfancybutton').addClass('fancybut');
			$('.fancyform').css('zIndex', 10000001);
			$('#kladr_autocomplete ul').css('zIndex', 10000001);
			$('#kladr_autocomplete .spinner').css('zIndex', 10000001);
			KladrJsObj.fancyForm = true;
		}
	},

	UnFancyForm: function(){
		if (KladrJsObj.fancyForm) {
			$('.fancyback').fadeOut('fast', function(){
				$('.addition.fancyadd').removeClass('fancyadd');
				$('.unfancybutton.fancybut').removeClass('fancybut');
				$('.fancyform').css('zIndex', 1);
				$('#kladr_autocomplete ul').css('zIndex', 9999);
				$('#kladr_autocomplete .spinner').css('zIndex', 9999);

				if (typeof(UnFancyKladr) == "function")
					UnFancyKladr();
				KladrJsObj.fancyForm = false;

				if (typeof(KladrJsObj.submitKladr) == 'function') {
					KladrJsObj.submitKladr({'fulladdr':$('#address').text(), "kladrobj":KladrJsObj.lastobject});
				} else {
					if (KladrJsObj.newVersionTemplate)
						BX.Sale.OrderAjaxComponent.sendRequest();
					else
						submitForm();
				}
			});
		}
	},

	/**
	 * Called on change address button click
	 */
	nobasemessage: function(){
		KladrJsObj.UnBlockAdrProps();
		KladrJsObj.CleanAdrProps();
		$('.nobasemessage').remove();
		$('.nobasemessage_adr').remove();
		KladrJsObj.FormKladr({"ajax": false});
	},

	checkErrors: function(){
		if (KladrSettings.kladripoladmin) {
			if (!window.jQuery) {
				alert(BX.message('nojquery'));
			}
		}
		if (typeof($.fias) != "object") {
			$("script[src='/bitrix/js/ipol.kladr/jquery.fias.min.js']").remove();
			KladrJsObj.addScript("/bitrix/js/ipol.kladr/jquery.fias.min.js");
			KladrJsObj.setCommerceToken.checker();
		}
	},

	/**
	 * Unmake KLADR form and release address inputs
	 */
	FuckKladr: function(){
		if ($('#' + KladrJsObj.kladrdivid).length) {
			$('#' + KladrJsObj.kladrdivid).remove();
		} else if ($('.nobasemessage').length) {
			$('.nobasemessage').remove();
		}
		KladrJsObj.ShowAdrProps();
		KladrJsObj.UnBlockAdrProps();
	},

	/**
	 * Add 'Not Russia' checkbox to DOM
	 * @param afterID
	 */
	initNotRusCheckbox: function(afterID){
		$(afterID).after('<input type="checkbox" id="SAdr_notrus_checkid" /><label class="notRussia" for="SAdr_notrus_checkid">' + BX.message('notrussia') + '</label>');
		$('#SAdr_notrus_checkid').prop("checked", KladrJsObj.locations_not_rus_checked);
		$("#SAdr_notrus_checkid").change(function(){
			if ($(this).prop("checked")) {
				KladrJsObj.locations_not_rus_checked = true;
			} else {
				KladrJsObj.locations_not_rus_checked = false;
			}
			BX.Sale.OrderAjaxComponent.sendRequest();
		});
	},

	changeLocationCode: function(code){
		$('[name=ORDER_PROP_' + KladrJsObj.locPropId + ']').attr("value", code).val(code);
	},

	getBitrixLocationCodeByName: function(city, region, type){
		var msg = 'ipolkladrlocation=print&ipolkladrnewcity=' + city + '&ipolkladrnewregion=' + region + '&ipolkladrnewtype=' + type;

		if (KladrSettings.country_rus_id)
			msg += '&country_rus_id=' + KladrSettings.country_rus_id;
		if (KladrSettings.country_rus_code)
			msg += '&country_rus_code=' + KladrSettings.country_rus_code;

		/*
		TODO: Change to POST
		 */
		$.ajax({
			type: 'GET',
			url:  '/bitrix/js/ipol.kladr/getCode.php',
			data: msg,
			success: function(data){
				if (data && data != '') {
					var obj = jQuery.parseJSON(data);
					KladrJsObj.changeLocationCode(obj.code);
					KladrJsObj.saveLoc = obj;
					BX.Sale.OrderAjaxComponent.sendRequest();
				} else {
					console.warn('Bad location code');
				}
			}
		});
	},

	/**
	 * Init KLADR location selection form, configure fias plugin
	 */
	initLocationInput: function(){
		$("#" + KladrJsObj.smart_locid).fias({
			type:        $.fias.type.city,
			withParents: true,
			verify:      true,
			token:       KladrSettings.kladripoltoken,
			oneString: false,
			/* limit:       30, */

			select: function(obj){
				if (!$.isEmptyObject(obj) && obj.name) {
					var kladrRegion    = '';
					var kladrRegionArr = [];

					obj.parents.forEach(function(el, index, array){
						if (el.type == BX.message('RESP'))
							kladrRegionArr[index] = el.type + ' ' + el.name;
						else if (el.type == BX.message('IPOL_KLADR_JS_LBL_CITY'))
							kladrRegionArr[index] = el.name;
						else
							kladrRegionArr[index] = el.name + ' ' + el.type.toLowerCase();
					});

					kladrRegion = kladrRegionArr.join(',');
					KladrJsObj.getBitrixLocationCodeByName(obj.name, kladrRegion, obj.type.toLowerCase());
				}
			},

			check: function(obj){
				if (!$.isEmptyObject(obj) && obj.name) {
					var objq = {};

					objq.type       = $.fias.type.city;
					objq.token      = KladrSettings.kladripoltoken;
					objq.url        = "https://kladr-api.com/api.php";
					objq.query      = obj.name;
					objq.withParent = true;

					$.fias.api(objq, function(answer){
						var kladrRegion    = '';
						var kladrRegionArr = [];

						answer.forEach(function(el, index){
							if(obj.id == el.id)
								obj = el;
						});

						KladrJsObj.kladr_city_obj = obj;
						KladrJsObj.setvalueLocationInput(obj);

						obj.parents.forEach(function(el, index, array){
							if (el.type == BX.message('RESP'))
								kladrRegionArr[index] = el.type + ' ' + el.name;
							else if (el.type == BX.message('IPOL_KLADR_JS_LBL_CITY'))
								kladrRegionArr[index] = el.name;
							else
								kladrRegionArr[index] = el.name + ' ' + el.type.toLowerCase();
						});

						kladrRegion = kladrRegionArr.join(',');
						KladrJsObj.getBitrixLocationCodeByName(obj.name, kladrRegion, obj.type.toLowerCase());
					});
				} else {
					if (KladrJsObj.kladr_city_obj)
						KladrJsObj.setvalueLocationInput(KladrJsObj.kladr_city_obj);
					else
						KladrJsObj.setvalueLocationInput({name: ''});
				}
			},

			change: function(obj){
				if (!$.isEmptyObject(obj))
					KladrJsObj.kladr_city_obj = obj;
			},

			close: function(){
				/* -- */
			},

			labelFormat: function(obj, query){
				var label = '';
				var n = obj.name.toLowerCase();

				query = query.name.toLowerCase();

				var start = n.indexOf(query);
				start = start > 0 ? start : 0;

				if (obj.typeShort) {
					label += obj.typeShort + '. ';
				}

				if (query.length < obj.name.length) {
					label += obj.name.substr(0, start);
					label += '<strong>' + obj.name.substr(start, query.length) + '</strong>';
					label += obj.name.substr(start + query.length, obj.name.length - query.length - start);
				} else {
					label += '<strong>' + obj.name + '</strong>';
				}

				if (obj.parents) {
					for (var k = obj.parents.length - 1; k > -1; k--) {
						var parent = obj.parents[k];
						if (parent.name) {
							if (label) label += '<small>, </small>';
							label += '<small>' + parent.name + ' ' + parent.typeShort + '.</small>';
						}
					}
				}

				return label;
			},

			valueFormat: function(obj, query){
				return KladrJsObj.getValFormatFromKladrCity(obj);
			}
		});
	},

	getValFormatFromKladrCity: function(obj){
		var label = '';

		if (obj.typeShort) {
			label += obj.typeShort + '. ';
		}
		label += obj.name;

		if (obj.parents) {
			for (var k = obj.parents.length - 1; k > -1; k--) {
				var parent = obj.parents[k];
				if (parent.name) {
					if (label)
						label += ', ' + parent.name + ' ' + parent.typeShort + '.';
				}
			}
		}

		return label;
	},

	/**
	 * Hides standard location selector and add KLADR selector instead
	 */
	changeLocationInput: function(){
		var after = '[data-property-id-row=' + KladrJsObj.locPropId + '] .bx-sls';
		if (!$(after).length)
			after = '.KladrHideThisLocation';

		if ($(after).length) {
			if (!KladrJsObj.locations_not_rus_checked) {
				if (after != '.KladrHideThisLocation') {
					$($(after).children()).each(function(i, obj){
						if (!$(obj).hasClass('quick-locations'))
							$(obj).hide();
					});
				} else {
					$(after).hide();
				}

				$('.smartadr_location').remove();
				$(after).after('<div class="smartadr_location"><input type="text" id="' + KladrJsObj.smart_locid + '"></div>');
				$("#altProperty").parent().hide();

				after = '#' + KladrJsObj.smart_locid;

				KladrJsObj.initLocationInput();
			}

			if (KladrSettings.locations_not_rus)
				KladrJsObj.initNotRusCheckbox(after);
		}
	},

	setvalueLocationInput: function(obj){
		if (!KladrJsObj.locations_not_rus_checked)
			$("#" + KladrJsObj.smart_locid).fias('controller').setValue(obj);

		let bitrixLocation = $(".bx-ui-sls-container .bx-ui-sls-fake").attr("value");
		let addressList = $("select[name='ADDRESS_ID'] option");
		addressList.each(element => {
			let el = addressList[element];
			let cityId = el.dataset.kladrCity;
			let location = el.dataset.location;

			if((cityId === "" && location === "") || (!location && cityId && cityId !== obj.id) || (location && location !== bitrixLocation)) {
				el.remove();
			}
		});

		if($("select[name='ADDRESS_ID'] option") && $("select[name='ADDRESS_ID'] option").length === 1) {
			$(".container-address").remove();
		}

		if($("select[name='ADDRESS_ID'] option") && $("select[name='ADDRESS_ID'] option").length === 0) {
			$(".container-address").remove();
		}
	},

	updateZIP: function(value){
		if (KladrJsObj.zipPropId) {
			$("[name='ORDER_PROP_" + KladrJsObj.zipPropId + "']").val(value);
			/* Prevent ZIP update by SOA script */
			if ($("#ZIP_PROPERTY_CHANGED").length)
				$("#ZIP_PROPERTY_CHANGED").val('Y');
		}
	},

	/**
	 * onAjaxSuccess event handler for modern SOA
	 * @param ajaxAns
	 */
	setall: function(ajaxAns){
		var obj;

		if (KladrJsObj.newVersionTemplate) {
			/* Modern JS SOA */
			if (Object.keys(ajaxAns).indexOf("order") !== -1) {
				var loccode;
				var locPropId = KladrJsObj.locPropId;
				var skipForThisDelivery = false;

				/* Buyer profiles */
				if (ajaxAns.order.USER_PROFILES && !$.isEmptyObject(ajaxAns.order.USER_PROFILES)) {
					var lastprofile = KladrJsObj.profile.current; /* Save previous selected profile ID */

					KladrJsObj.profile.isUsed  = true;
					KladrJsObj.profile.current = false;

					$.each(ajaxAns.order.USER_PROFILES, function(index, value){
						if (value.CHECKED == "Y") {
							KladrJsObj.profile.current = value.ID;
						}
					});

					/* Profiles used and checked no one || IDs are not the same -> new profile selected */
					KladrJsObj.profile.isChanged = (KladrJsObj.profile.current === false || KladrJsObj.profile.current !== lastprofile);
				}

				/* Checks if KLADR form not needed for this delivery (usually for pickup) */
				skipForThisDelivery = KladrJsObj.checkSkippedDelivery(ajaxAns.order.DELIVERY);

				/* Define location and zip prop Ids */
				$.each(ajaxAns.order.ORDER_PROP.properties, function(index, value){
					if (value.IS_LOCATION == "Y") {
						loccode = value.VALUE[0] != "" ? value.VALUE[0] : value.DEFAULT_VALUE;
						KladrJsObj.locPropId = value.ID;
					} else if (value.IS_ZIP == "Y") {
						KladrJsObj.zipPropId = value.ID;
					}
				});

				/* Bitrix location code changes */
				// if (KladrJsObj.lastLocationCode != loccode)
					//KladrJsObj.kladr_city_obj = false;

				if (KladrSettings.hideLocation && KladrJsObj.locPropId)
					KladrJsObj.changeLocationInput();

				/* Drop KLADR city if location Id changes, usually by switching payer type */
				if (locPropId != KladrJsObj.locPropId)
					KladrJsObj.kladr_city_obj = false;

				if (KladrJsObj.kladr_city_obj) {
					if (!$.isEmptyObject(KladrJsObj.kladr_city_obj)) {
						if (KladrSettings.hideLocation)
							KladrJsObj.setvalueLocationInput(KladrJsObj.kladr_city_obj);

						KladrJsObj.FuckKladr();
						obj = {'ajax':true};
						obj['kladr'] = {NotRussia:"0", contentType:"city", kladrid:KladrJsObj.kladr_city_obj.id, kltobl:KladrJsObj.kladr_city_obj};
						if (!skipForThisDelivery)
							KladrJsObj.FormKladr(obj);
					}
				} else {
					if (loccode != "") {
						KladrJsObj.lastLocationCode = loccode;

						$.ajax({
							type: 'GET',
							url:  '/bitrix/js/ipol.kladr/getLoc.php',
							data: 'code=' + loccode,
							success: function(res){
								if (res != "" && res.indexOf("KLADR Error") == -1) {
									KladrJsObj.FuckKladr();

									var resJson = JSON.parse(res);
									obj = {'ajax': true};
									obj['kladr'] = {NotRussia: "0", contentType: "city", kladrid: resJson.id, kltobl: resJson};

									if (!skipForThisDelivery)
										KladrJsObj.FormKladr(obj);

									if (KladrSettings.hideLocation && KladrJsObj.locPropId)
										KladrJsObj.setvalueLocationInput(resJson);
								} else {
									if (KladrSettings.notShowForm) {
										KladrJsObj.FuckKladr();
									} else {
										KladrJsObj.kladrtownid = false;
										KladrJsObj.contentType = false;
										KladrJsObj.lastobject  = {};
										$('.kltobl:last').text('');

										if (!skipForThisDelivery)
											KladrJsObj.FormKladr({'ajax': true});
									}
								}
							}
						});
					} else {
						if (KladrSettings.notShowForm) {
							KladrJsObj.FuckKladr();
						} else {
							KladrJsObj.kladrtownid = false;
							KladrJsObj.contentType = false;
							KladrJsObj.lastobject  = {};
							$('.kltobl:last').text('');

							if (!skipForThisDelivery)
								KladrJsObj.FormKladr({'ajax': true});
						}
					}
				}
			}
		} else {
			/* Old SOA */
			if (typeof(StartKladrObj) != 'undefined' && !$.isEmptyObject(StartKladrObj)) {
				obj = StartKladrObj;
				StartKladrObj = false;
			} else {
				obj = {'ajax': true};
			}

			var newTemplateAjax = (typeof(ajaxAns) != 'undefined' && ajaxAns !== null && typeof(ajaxAns.kladr) == 'object') ? true : false;
			if (newTemplateAjax) {
				KladrJsObj.FuckKladr();
				obj['kladr'] = ajaxAns.kladr;
			}

			if ($('#' + KladrJsObj.kladrdivid).length || $('.nobasemessage').length)
				return;

			KladrJsObj.FormKladr(obj);
		}

		let locationKladrId = $("input#SAdr_city").attr("data-kladr-id");
		if(locationKladrId && locationKladrId.length === 0) {
			$(".container-address").remove();
		}
	},
	
	addScript: function(src){
		var script = document.createElement('script');
		script.src   = src;
		script.async = false;
		document.head.appendChild(script);
	},
	
	checkYandexApi: function(){
		var path = "//api-maps.yandex.ru/2.1/?load=package.standard&mode=release&lang=ru-RU";		
		if (KladrSettings.YandexAPIkey.length > 0)
			path += "&apikey=" + KladrSettings.YandexAPIkey;
				
		if (KladrSettings.ShowMap && typeof(ymaps) == 'undefined') {			
			KladrJsObj.addScript(path);
			KladrJsObj.mapUpdate();
			console.log("Load Yandex maps API from ipol.kladr module");
		}
	},
	
	setCommerceToken: {
		timer: false,
		checker: function(){
			if (KladrJsObj.setCommerceToken.timer && (typeof($.fias) == "object")) {								
				$.fias.token = KladrSettings.kladripoltoken;
				$.fias.url = 'https://kladr-api.com/api.php';
				
				clearTimeout(KladrJsObj.setCommerceToken.timer);
				KladrJsObj.setCommerceToken.timer = false;
			} else {
				KladrJsObj.setCommerceToken.timer = setTimeout(KladrJsObj.setCommerceToken.checker, 1000);				
			}
		},
	},
	
	checkSkippedDelivery: function(deliveries){
		var skipCurrentDelivery = false;
		
		if (!$.isEmptyObject(KladrSettings.skipDeliveries)) {
			$.each(deliveries, function(index, value) {
			if (value.CHECKED == "Y") {
				if (KladrSettings.skipDeliveries.indexOf(value.ID) !== -1)
					skipCurrentDelivery = true;
				}
			});
		}
		
		return skipCurrentDelivery;
	},
	
	executeFunctionByName: function(name, context /*, args */){
		/* Thanks Jason Bunting */
		var args = Array.prototype.slice.call(arguments, 2);
		var namespaces = name.split(".");
		var func = namespaces.pop();
		for (var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		
		return context[func].apply(context, args);
	},
}

$(document).ready(function(){
	KladrJsObj.setCommerceToken.checker();
	setTimeout(KladrJsObj.checkYandexApi, 5000);
	
	if (typeof(BX.Sale) != 'undefined') {
		KladrJsObj.newVersionTemplate = typeof(BX.Sale.OrderAjaxComponent) != 'undefined' ? true : false;
	}
	
	if (typeof BX !== 'undefined' && BX.addCustomEvent) {
		BX.addCustomEvent('onAjaxSuccess', KladrJsObj.setall);
	}

	if (KladrJsObj.newVersionTemplate) {
		BX.Sale.OrderAjaxComponent.sendRequest();
	}
});