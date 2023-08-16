// Ширина окна для ресайза
WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth
WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight
BODY = document.getElementsByTagName('body')[0]
OVERLAY = document.querySelector('.overlay')


document.addEventListener('DOMContentLoaded', function () {
	// Мини всплывающие окна
	$('.mini_modal_btn').click(function(e) {
		e.preventDefault()

		const modalId = $(this).data('modal-id')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
			$('.mini_modal').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		} else {
			$('.mini_modal_btn').removeClass('active')
			$(this).addClass('active')

			$('.mini_modal').removeClass('active')
			$(modalId).addClass('active')

			if (is_touch_device()) $('body').css('cursor', 'pointer')
		}
	})

	// Закрываем всплывашку при клике за её пределами
	$(document).click(e => {
		if ($(e.target).closest('.modal_cont').length === 0) {
			$('.mini_modal, .mini_modal_btn').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		}
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: "Закрыть",
		NEXT: "Следующий",
		PREV: "Предыдущий",
		MODAL: "Вы можете закрыть это модальное окно нажав клавишу ESC"
	}

	Fancybox.defaults.template = {
		closeButton: '<svg><use xlink:href="images/sprite.svg#ic_close"></use></svg>',
		spinner: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="25 25 50 50" tabindex="-1"><circle cx="50" cy="50" r="20"/></svg>',
		main: null
	}


	// Всплывающие окна
	const modalBtns = document.querySelectorAll('.modal_btn')

	if (modalBtns) {
		modalBtns.forEach(el => {
			el.addEventListener('click', e => {
				e.preventDefault()

				Fancybox.close()

				Fancybox.show([{
					src: document.getElementById(el.getAttribute('data-modal')),
					type: 'inline'
				}])
			})
		})
	}

	$('.modal .close_btn').click(function(e) {
		e.preventDefault

		Fancybox.close()
	})


	// Фильтр - спойлер
	$('.table th .filter_btn').click(function(e) {
		e.preventDefault()

		$(this).toggleClass('active')
		$('.table thead .field').toggleClass('show')
	})


	// Таблица - сортировка
	$('.table th.sort').click(function() {
		$('.table thead th').removeClass('active')
		$(this).addClass('active')
	})


	// Таблица - выбор всех строк
	$('.table th .checkbox').click(function(e) {
		if (e.target.nodeName == 'LABEL') {
			$(this).toggleClass('active')

			if($(this).hasClass('active')) {
				$('.table tbody tr').addClass('selected')
				$('.table td.check .checkbox input').prop('checked', true)
			} else {
				$('.table tbody tr').removeClass('selected')
				$('.table td.check .checkbox input').prop('checked', false)
			}
		}
	})


	// Таблица - выбор строки
	$('.table td.check .checkbox').click(function(e) {
		if (e.target.nodeName == 'LABEL') {
			$(this).closest('tr').toggleClass('selected')
		}
	})


	// Таблица - редактирование строки
	$('.table .head .btns .edit_btn').click(function(e) {
		if($('.table td.check .checkbox input:checked').length) {
			$('.table').toggleClass('editing')
		}
	})


	// Таблица - удаление строк строки
	$('.table .head .btns .delete_btn').click(function(e) {
		if($('.table td.check .checkbox input:checked').length) {
			Fancybox.show([{
				src: '#confirm_delete_modal',
				type: 'inline'
			}])
		}
	})


	// Настройки отображения столбцов
	$('.table .head .settings .save_btn').click(function(e) {
		e.preventDefault()

		let data = $('.table .head .settings input[name="settings"]').serializeArray()
		console.log(data)

		$('.table table th, .table table td').hide()
		$('.table .check, .table .documents, .table .ypd, .table .act, .table .treaty').show()

		data.forEach(el => $('.table .'+ el.value).show())
	})


	// Модальное окно - Новая оплата
	$('.form .add_payment_btn').click(function(e) {
		e.preventDefault()

		let html = $(this).closest('.form').find('.template').html()

		$(this).closest('.form').find('.template').before(html)

		// Календарь
		document.querySelectorAll('.date_input').forEach(el => {
			new AirDatepicker(el, {
				position: 'bottom right',
				// minDate: new Date(),
				autoClose: true,
				showOtherMonths: false,
				navTitles: {
					days: 'MMMM yyyy',
					months: 'yyyy',
					years: 'yyyy1 - yyyy2'
				},
				prevHtml: '<svg class="icon"><use xlink:href="images/sprite.svg#ic_arr_hor"></use></svg>',
				nextHtml: '<svg class="icon"><use xlink:href="images/sprite.svg#ic_arr_hor"></use></svg>'
			})
		})
	})


	// Модальное окно - Удаление оплаты
	$('body').on('click', '.form .delete_btn', function (e) {
		e.preventDefault()

		$(this).closest('.payment').remove()
	})


	// Календарь
	document.querySelectorAll('.date_input').forEach(el => {
		new AirDatepicker(el, {
			position: 'bottom right',
			// minDate: new Date(),
			autoClose: true,
			showOtherMonths: false,
			navTitles: {
				days: 'MMMM yyyy',
				months: 'yyyy',
				years: 'yyyy1 - yyyy2'
			},
			prevHtml: '<svg class="icon"><use xlink:href="images/sprite.svg#ic_arr_hor"></use></svg>',
			nextHtml: '<svg class="icon"><use xlink:href="images/sprite.svg#ic_arr_hor"></use></svg>'
		})
	})


	// Кастомный select
	const selects = document.querySelectorAll('select')

	if (selects) {
		selects.forEach(el => NiceSelect.bind(el))
	}


	// Выбор файла
	const fileInputs = document.querySelectorAll('form input[type=file]')

	if (fileInputs) {
		fileInputs.forEach(el => {
			el.addEventListener('change', () => el.closest('.file').querySelector('label .name').innerText = el.value)
		})
	}


	// Отправка форм
	$('form').submit(function(e) {
		e.preventDefault()

		Fancybox.close()

		Fancybox.show([{
			src: '#success_modal',
			type: 'inline'
		}])
	})
})



window.addEventListener('resize', function () {
	WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight

	let windowW = window.outerWidth

	if (typeof WW !== 'undefined' && WW != windowW) {
		// Перезапись ширины окна
		WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth


		// Моб. версия
		if (!fakeResize) {
			fakeResize = true
			fakeResize2 = false

			document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1, maximum-scale=1'
		}

		if (!fakeResize2) {
			fakeResize2 = true

			if (windowW < 375) document.getElementsByTagName('meta')['viewport'].content = 'width=375, user-scalable=no'
		} else {
			fakeResize = false
			fakeResize2 = true
		}
	}
})