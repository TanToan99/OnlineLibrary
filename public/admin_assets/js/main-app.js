$(document).ready(function(){
	// add Category
	$('.category-add').find('.btn-add').on('click', function(){
		var categoryname = $('.category-add input:first').val();
		if(categoryname !== ''){
			$.post(api_domain+'/category/add',
				{
					_token: api_token,
					name: categoryname
				},
				function(data){
					if(data.error == 0){
						var html = '<tr data-row="'+data.id+'">'+
						'<td><span class="category-name">'+categoryname+'</span></td>'+
						'<td class="text-right">'+
						'<a href="javascript:void(0);" class="btn btn-sm btn-primary category-newname" data-id="'+data.id+'">Chỉnh sửa</a>&nbsp'+
	                    '<a href="javascript:void(0);" class="btn btn-sm btn-danger category-remove" data-id="'+data.id+'">Xóa</a>'+
	                    '</td>';
						$('.category-content').prepend(html);
						alertify.success('Thêm danh mục thành công');
						$('.category-add input:first').val('');
					}
					else{
						alertify.error(data.message);
					}
				}, 'json'
			);
		}
		else{
			alertify.error('Tên danh mục trống');
		}
	});
	// new name category
	$('.category-content').on('click', '.category-newname', function(){
		var categoryid = $(this).attr('data-id');
		alertify.prompt( 'Thay đổi tên danh mục', 'Tên danh mục mới', '', function(evt, value) {
			if(value !== ''){
				$.ajax({
					url: api_domain+'/category/updated',
					method: 'PUT',
					data: {
						id: categoryid,
						name: value,
						_token: api_token
					},
					success: function(data){
						if(data.error == 0)
						{
							$('[data-row='+categoryid+'] .category-name').text(data.message);
							alertify.success('Thay đổi thành công');
						}
						else{
							alertify.error(data.message);
						}
					}
				});
			}
		}, function(){});
	});
	// remove category
	$('.category-content').on('click', '.category-remove', function(){
		var categoryid = $(this).attr('data-id');
		alertify.confirm('Xác nhận xóa', 'Nếu bạn xóa, tất cả sách cùng danh mục sẽ xóa theo!', function(){
			$.ajax({
				url: api_domain+'/category/deleted',
				method: 'DELETE',
				data: {
					id: categoryid,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0)
					{
						$('[data-row='+categoryid+']').remove();
						alertify.success(data.message);
					}
					else{
						alertify.error(data.message);
					}
				}
			});
		}, function(){});
	});

	// Book Remove
	$('.book-remove').on('click', function(){
		var bookid = $(this).attr('data-id');
		alertify.confirm('Xác nhận xóa', 'Nếu bạn xóa, sách sẽ mất đi trong các đơn hàng!', function(){
			$.ajax({
				url: api_domain+'/books/deleted',
				method: 'DELETE',
				data: {
					id: bookid,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0){
						$('[data-row='+bookid+']').remove();
						alertify.success(data.message);
					}
					else{
						alertify.error(data.message);
					}
				}
			});
		}, function(){});
	});

	// User Remove
	$('.user-remove').on('click', function(){
		var userid = $(this).attr('data-id');
		alertify.confirm('Xác nhận xóa', 'Nếu bạn xóa, các đơn hàng của thành viên sẽ xóa theo!', function(){
			$.ajax({
				url: api_domain+'/users/deleted',
				method: 'DELETE',
				data: {
					id: userid,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0){
						$('[data-row='+userid+']').remove();
						alertify.success(data.message);
					}
					else{
						alertify.error(data.message);
					}
				}
			});
		}, function(){});
	});

	// Comment Remove
	$('.comment-remove').on('click', function(){
		var commentid = $(this).attr('data-id');
		alertify.confirm('Xác nhận xóa', 'Bạn chắc chắn muốn xóa bình luận này!', function(){
			$.ajax({
				url: api_domain+'/comment/deleted',
				method: 'DELETE',
				data: {
					id: commentid,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0){
						$('[data-row='+commentid+']').remove();
						alertify.success(data.message);
					}
					else{
						alertify.error(data.message);
					}
				}
			});
		}, function(){});
	});
	function viewOrderStatus(status){
		switch(status) {
			case 1:
		    	return '<span class="btn-sm btn-warning">Chờ xử lý<span>';
		    break;
		  	case 2:
		    	return '<span class="btn-sm btn-warning">Chờ nhận sách<span>';
		    break;
		  	case 3:
		    	return '<span class="btn-sm btn-danger">Đã hủy<span>';
		    break;
		  	case 4:
		    	return '<span class="btn-sm btn-primary">Đang mượn<span>';
		    break;
		  	default:
		    	return '<span class="btn-sm btn-success">đã trã<span>';
		}
	}
	// Order Detail
	$('.order-show').on('click', function(){
		var orderID = $(this).attr('data-id');
		$.get(api_domain+'/order/show', {id: orderID}, function(data){
			var html = '<p>Độc Giả: <b>'+data.readers+'</b></p>'+
			'<p>Số điện thoại: '+data.contact+
			'<p>Tình Trạng: '+viewOrderStatus(data.status)+
			'<p>Thời Gian Đăng Ký Thuê: <b>'+data.created_time+'</b></p>';
			if(data.status >= 5){
				html += '<p>Thời Gian Nhận Sách: <b>'+data.date_borrow+'</b></p>'+
				'<p>Thời Gian Trã Sách: <b>'+data.date_give_back+'</b></p>';
			}
			html += '<p>Tổng Số Lượng Sách Thuê: <b>'+data.count+'</b></p>'+
			'<p>Ghi chú: <b>'+data.note+'</b></p>'+
			'<table class="table"><thead><tr><th>Tên Sách</th><th>Số Lượng</th><th>Giá Thuê</th><th>Tổng Tiền</th></tr></thead><tbody>';
			$.each(data.book, function( i, l ) {
				html += '<tr>'+
				'<td>'+l.name+'</td>'+
				'<td>'+l.quantity+' (Còn '+l.bquantity+')</td>'+
				'<td>'+l.price+'đ</td>'+
				'<td>'+l.total+'đ</td>'+
				'</tr>';
			});
			html +='</tbody><tfoot><tr><td colspan="4">Tổng: '+data.total+'đ</td></tr></tfoot></table>';
			$('#detail-order .panel-body').html(html);
			$('#detail-order').modal('show');
		});
	});

	//allow order
	$('.allow-order').on('click', function(){
		var orderID = $(this).attr('data-id');
		alertify.confirm('Xác nhận', 'Bạn đồng ý cho thuê sách?', function(){
			$.ajax({
				url: api_domain+'/order/updated',
				method: 'PUT',
				data: {
					id: orderID,
					status: 2,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0){
						$('[data-row='+orderID+']').remove();
						alertify.success('Trạng thái chuyển sang chờ nhận sách');
					}else{
						alertify.success(message);
					}
				}
			});
		}, function(){});
	});

	// report Order
	$('.order-report').on('click', function(){
		var obj = $(this);
		var DetailID = $(obj).attr('data-id');
		$('#book-price').val('');
		$('#note').val('');
		alertify.confirm('Báo Mất', '<lable>Tiền phạt:</lable><input class="form-control" id="book-price" type="number" min="0" placeholder="Giá tiền phạt"><lable>Ghi chú:</lable><input class="form-control" id="note" type="text" placeholder="Ghi chú thêm...">', function(){
			var price = $('#book-price').val();
			var note = $('#note').val();
			if(price !== ''){
				$.post(api_domain+'/lost-books/add', {_token: api_token, id:DetailID, price: price, note: note}, function(data){
					if(data.error == 0){
						alertify.success('Đã báo cáo');
					}
					else{
						alertify.error(data.message);
					}
					$(obj).attr('class', 'btn btn-sm btn-info');
					$(obj).text('Đã báo cáo');
					$(obj).attr('disabled', '');
				}, 'json')
			}
			
		}, function(){});
	});

	//report remove
	$('.report-remove').on('click', function(){
		var lostID = $(this).attr('data-id');
		alertify.confirm('Xác nhận', 'Độc giả đã trã sách?', function(){
			$.ajax({
				url: api_domain+'/lost-books/deleted',
				method: 'DELETE',
				data: {
					id: lostID,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0){
						$('[data-row='+lostID+']').remove();
					}else{
						alertify.success(message);
					}
				}
			});
		}, function(){});
	});


	//received book
	$('.received-book').on('click', function(){
		var orderID = $(this).attr('data-id');
		alertify.confirm('Xác nhận', 'Độc giả đã nhận sách?', function(){
			$.ajax({
				url: api_domain+'/order/updated',
				method: 'PUT',
				data: {
					id: orderID,
					status: 4,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0){
						$('[data-row='+orderID+']').remove();
						//alertify.success('Trạng thái chuyển sang mới');
					}else{
						alertify.success(message);
					}
				}
			});
		}, function(){});
	});

	//refused order
	$('.refused-order').on('click', function(){
		var orderID = $(this).attr('data-id');
		alertify.prompt('Xác nhận', 'Lí do từ chối đơn hàng', 'Số lượng sách không đủ', function(evt, value){
			$.ajax({
				url: api_domain+'/order/updated',
				method: 'PUT',
				data: {
					id: orderID,
					status: 3,
					note: value,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0){
						$('[data-row='+orderID+']').remove();
						alertify.success('Trạng thái đã chuyển sang bị từ chối');
					}else{
						alertify.success(message);
					}
				}
			});
		}, function(){});
	});

	//return book
	$('.return-book').on('click', function(){
		var orderID = $(this).attr('data-id');
		alertify.confirm('Xác nhận', 'Độc giả đã trã sách?', function(){
			$.ajax({
				url: api_domain+'/order/updated',
				method: 'PUT',
				data: {
					id: orderID,
					status: 5,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0){
						$('[data-row='+orderID+']').remove();
						//alertify.success('Trạng thái chuyển sang mới');
					}else{
						alertify.success(message);
					}
				}
			});
		}, function(){});
	});

	//Remove Order
	$('.order-remove').on('click', function(){
		var orderID = $(this).attr('data-id');
		alertify.confirm('Xác nhận xóa', 'Bạn chắn chắn muốn xóa đơn hàng?', function(){
			$.ajax({
				url: api_domain+'/order/deleted',
				method: 'DELETE',
				data: {
					id: orderID,
					_token: api_token
				},
				success: function(data){
					if(data.error == 0){
						$('[data-row='+orderID+']').remove();
						alertify.success('Bạn đã xóa đơn hàng.');
					}
					else{
						alertify.error(data.message);
					}
				}
			});
		},function(){});
	});

});
jQuery(document).delegate('a.add-record', 'click', function(e) {
	e.preventDefault();    
	var content = jQuery('#sample_table tr'),
	size = jQuery('#tbl_posts >tbody >tr').length + 1,
	element = null,    
	element = content.clone();
	element.attr('id', 'row-'+size);
	element.find('.book-record').attr('name', 'book['+size+'][id]');
	element.find('.quantity-record').attr('name', 'book['+size+'][quantity]');
	element.find('.delete-record').attr('data-id', size);
	element.appendTo('#tbl_posts_body');
	element.find('.sn').html(size);
	element.find('.book-record').select2({
        placeholder: 'Chọn sách',
        ajax: {
          url: api_domain+'/books/api/search',
          dataType: 'json',
          delay: 250,
          processResults: function (data) {
            return {
              results: data
            };
          },
          cache: true
        }
      });
});
jQuery(document).delegate('a.delete-record', 'click', function(e) {
    if(jQuery('#tbl_posts >tbody >tr').length > 1){
		e.preventDefault();
		var id = jQuery(this).attr('data-id');
      	var targetDiv = jQuery(this).attr('targetDiv');
		alertify.confirm('Xác nhận', 'Bạn chắn chắn muốn xóa cột này?', function(){
	      	jQuery('#row-' + id).remove();
		    //regnerate index number on table
		    $('#tbl_posts_body tr').each(function(index) {
		      	//alert(index);
		      	$(this).find('span.sn').html(index+1);
		    });
	    	return true;
		}, function(){
		});
	}
	else{
		alertify.alert('Cảnh Báo', 'Tối thiểu phải có 1 cột');
	}
});