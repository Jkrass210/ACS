;(function() {
	"use strict";

	if (window.UISelect)
		return;

	window.UISelect = function(ID)
	{
		this.ID = ID;
		BX.ready(BX.delegate(this.init,this));

	}
    /*
    //скрипт для select с инпут
    var inputZbuttons = document.querySelectorAll('.myInputAddBtn');

    inputZbuttons.forEach(button => {
        button.addEventListener("click", function() {
            // console.log(this.parentNode.parentNode.nextElementSibling);
            // Store results
            var resultStored = this.parentNode.childNodes[1].value;
            // Reset value of input
            this.parentNode.childNodes[1].value = "";

            // Get items container
            var items = this.parentNode.parentNode.nextElementSibling;
            // Add items to container
            if (resultStored !== '') {
                items.innerHTML += `<div class="custom-optionZ" style="flex-direction: row;" data-value="${resultStored}">${resultStored}</div>`
                // items.innerHTML += "<li>" + resultStored + "</li>";
            } else {
                alert('Поле не должно быть пустым')
            }

        });
    })
    */

	window.UISelect.prototype = {

		init: function()
		{
            this.parentNode = BX('select_' + this.ID);
            this.valuesNode = BX('select_' + this.ID + '_values');
            this.searchInputNode = null;
			this.isMulti = this.parentNode.dataset['multi'] == 'true';
			this.allowAdd = this.parentNode.dataset['allowadd'] == 'true';
			this.inputname = (this.parentNode.dataset['inputname'] != undefined && this.parentNode.dataset['inputname'].length > 0)?this.parentNode.dataset['inputname']:'PROPERTY[' + this.ID + ']';
			this.searchTimeout = 0;

            this.listNode = BX.findChild(this.parentNode, {
					"class" : "select-wrapperZ__inner"
				},
				true
			);
			this.selectWrapper = BX.findChild(this.parentNode, {
					"class" : "selectZ"
				},
				true
			);
			this.textContent = BX.findChild(this.valuesNode,{'tag':'span'},true);
            this.itemsNode = BX.findChild(this.listNode, {
					"class" : "scrollBar"
				},
				true
			);
            this.setItems();

			for (i in this.items) {
				if (this.items.hasOwnProperty(i)) {
					let item = this.items[i];
					BX.bind(item, 'click', BX.proxy(function() {
						this.onItemClick(item);
					}, this));
				}
			}


			this.initSearch();


			document.addEventListener("click", this.onDocumentClick.bind(this));
			BX.bind(this.valuesNode, 'click', BX.proxy(this.showList, this));

			this.setValue();
            // console.log(this);
		},

		setItems: function()
		{
			this.items = BX.findChild(this.itemsNode, {
					"class" : "custom-optionZ"
				},
				true,
				true
			);
		},

		initSearch: function()
		{
			this.searchInputNode = BX.findChild(
				this.listNode,
				{
					"class" : "myInputAdd"
				},
				true
			);

			if(this.allowAdd){
				this.button = BX.findChild(
					this.searchInputNode,
					{
						tag: 'button'
					},
					true
				);
			}
			this.searchInput = BX.findChild(
				this.searchInputNode,
				{
					tag: 'input'
				},
				true
			);

			if(this.button != undefined){
				BX.bind(this.button, 'click', BX.proxy(function() {
					this.addItem(this.searchInput.value);
				}, this));
			}

			if(this.searchInput != undefined){
				BX.bind(this.searchInput, 'keyup', BX.proxy(this.filterItems, this));
			}
		},

		addItem: function(value){
			console.log(value);

			var hasItem = false;
			var	foundedItem;

			if(value.length > 0){

				for (i in this.items) {
					if (this.items.hasOwnProperty(i)) {
						let item = this.items[i];

						if (item.textContent.trim() == value.trim()) {
							hasItem = true;
							foundedItem = item;
						}

					}
				}
				if(hasItem){
					BX.fireEvent(foundedItem,'click');
				}
				else{
					/// отправляем запрос на добавление
					if(this.button.dataset['propid'] > 0){
						BX.showWait();

						let that = this;

						let formdata = new FormData();
						let sessid = BX.bitrix_sessid();
						formdata.append('sessid', sessid);
						formdata.append('propID', this.button.dataset['propid']);
						formdata.append('value', value);

						BX.ajax.runComponentAction(
							'digimatix:ajax',
							'addEnumItem', {
								mode: 'class',
								data: formdata
							}
						)
						.then(function(response) {
							console.log(response);
							BX.closeWait();
							if (response.data && response.data.result) {
								/// добавляем элемент в список и кликаем
								that.items[response.data.result] = BX.create('div',{
									props: {
										className: 'custom-optionZ',
									},
									attrs: {'data-value': response.data.result},
									style: {
										'flex-direction': 'row'
									},
									text: value,
									events: {
										click: BX.delegate(function() {
											that.onItemClick(that.items[response.data.result]);
										}, that)
									}
								});
								that.itemsNode.appendChild(that.items[response.data.result]);
							} else if (response.data.error) {
								that.show_error(response.data.error);
							} else {
								that.show_error('Произошла ошибка');
							}
						}).catch(function(data) {
							BX.closeWait();
							var textArr = [];
							data.errors.forEach(function(error) {
								textArr.push(error.message)
							});
							that.show_error(textArr.join(";\n "));
						});
					}
				}
			}
			else{
				alert('Пустое значение добавить нельзя');
			}
		},

		show_error: function(error) {
			var error_window = new BX.CDialog({
				title: 'Ошибка',
				content: error,
				icon: 'remove',
				height: 100,
				width: 300,

				draggable: true,
				resizable: false,

				buttons: [
					BX.CDialog.prototype.btnClose,
				]
			});
			error_window.Show();
		},

        showList: function(event)
        {
			BX.toggleClass(this.selectWrapper,'openZ');
        },

		onItemClick: function(item)
		{
			// console.log(event,item);
			let selected = BX.hasClass(item,'selectedZ');
			if(this.isMulti){

			}
			else{
				BX.removeClass(this.selectWrapper,'openZ');
                var fields = BX.findChild(this.selectWrapper, {class: 'selectedZ'}, true, true);
                fields.forEach(function(element){
                    if(element != item)
                        BX.removeClass(element,'selectedZ');
                });
			}
			BX.toggleClass(item,'selectedZ');

			this.setValue();
		},

		/**
		 * @inheritDoc
		 */
		getValue: function()
		{
			var value = this.input.dataset.value;

			if (value !== "undefined" && typeof value !== "undefined")
			{
				return value;
			}

			return this.items[0].value;
		},

		setValue: function()
		{
			let text = '',
				inputs = BX.findChild(this.valuesNode,{tag: 'input'},true,true),
				hasSelected = false;

			let	name = this.inputname+'[]';//'PROPERTY[' + this.ID + '][]';
				if (!this.isMulti)
					name = this.inputname;//'PROPERTY[' + this.ID + ']';

			for (i in inputs) {
				if (inputs.hasOwnProperty(i)) {
					BX.remove(inputs[i]);
				}
			}

			this.items.forEach(function(item) {
				// noinspection EqualityComparisonWithCoercionJS

				if(BX.hasClass(item,'selectedZ')){
					if (this.isMulti) text += ' [';
					text += item.textContent
					if (this.isMulti) text += ']';

					let input = BX.create('input',{
						props: {
							type: 'hidden',
							name: name,
							value: item.dataset['value']
						}
					});
					BX.prepend(input, this.valuesNode);
					hasSelected = true;
				}
			}, this);

			if(!hasSelected){
				text = 'Не выбрано';
				let emptyInput = BX.create('input',{
					props: {
						type: 'hidden',
						name: name,
						value: ''
					}
				});

				BX.prepend(emptyInput, this.valuesNode);
			}

			BX.adjust(this.textContent,{
				text: text
			});
			if(this.searchInput && this.searchInput.value.length > 0){
				this.searchInput.value = '';
				BX.fireEvent(this.searchInput,'keyup');
			}

			BX.fireEvent(this.parentNode,'change');
		},

		filterItems: function(event) {
			event.preventDefault();
			var thisRegex = new RegExp(this.searchInput.value, 'gi');
			var that = this;
			if (this.searchTimeout) clearTimeout(this.searchTimeout);

			this.searchTimeout = setTimeout(function() {
				for (i in that.items) {
					if (that.items.hasOwnProperty(i)) {
						let item = that.items[i];
						if (that.searchInput.value.length <= 0) {
							BX.adjust(item, {
								attrs: {
									'hidden': false
								}
							});
						} else {
							// if (thisRegex.test(item.textContent)) {
							if (item.textContent.search(thisRegex) != -1) {
								BX.adjust(item, {
									attrs: {
										'hidden': false
									}
								});
							} else {
								BX.adjust(item, {
									attrs: {
										'hidden': true
									}
								});
							}
						}
					}
				}
			}, 500);
		},


		/**
		 * @inheritDoc
		 * @return {boolean}
		 */
		isChanged: function()
		{
			// noinspection EqualityComparisonWithCoercionJS
			return this.content != this.getValue();
		},

		onDocumentClick: function(event)
		{
			if(
				event.target != this.valuesNode
				&&  event.target != this.searchInputNode
				&&  event.target.parentNode != this.searchInputNode
			){
				BX.removeClass(this.selectWrapper,'openZ');
			}
		}
	};
})();