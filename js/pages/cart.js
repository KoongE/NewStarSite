$(document).ready(function() {
    // 숫자에 콤마 추가 함수
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
    }

    // [중요] 각 상품의 초기 단가를 저장 (수량 변경 시 계산용)
    $('.cart-buy-item').each(function() {
        const initialPrice = parseInt($(this).find('.total-price-text').text().replace(/[^0-9]/g, ''));
        $(this).data('unit-price', initialPrice);
    });

    // 실시간 금액 업데이트 함수
    function updateItemPrice($item) {
        const unitPrice = $item.data('unit-price');
        const count = parseInt($item.find('.input-count').val()) || 1;
        const totalPrice = unitPrice * count;
        $item.find('.total-price-text').text(formatNumber(totalPrice));
    }

    // --- 수량 조절 로직 (buy.js 참고 및 확장) ---

    // 1. 플러스 버튼
    $(document).on('click', '.btn-plus', function() {
        const $item = $(this).closest('.cart-buy-item');
        const $input = $(this).siblings('.input-count');
        const maxBuy = parseInt($item.find('.max-buy-count').val()) || 10;
        let count = parseInt($input.val()) || 0;

        if (count >= maxBuy) {
            alert("해당 상품의 1회 최대 구매 수량은 " + maxBuy + "개입니다.");
            return false;
        }

        $input.val(count + 1);
        updateItemPrice($item);
    });

    // 2. 마이너스 버튼
    $(document).on('click', '.btn-minus', function() {
        const $item = $(this).closest('.cart-buy-item');
        const $input = $(this).siblings('.input-count');
        let count = parseInt($input.val()) || 1;

        if (count > 1) {
            $input.val(count - 1);
            updateItemPrice($item);
        }
    });

    // 3. 입력창 포커스 시 전체 선택 (수정 편리성 강화)
    $(document).on('focus', '.input-count', function() {
        $(this).select();
    });

    // 4. 직접 입력 시 한도 체크 및 금액 업데이트
    $(document).on('keyup input', '.input-count', function() {
        const $item = $(this).closest('.cart-buy-item');
        const maxBuy = parseInt($item.find('.max-buy-count').val()) || 10;
        let val = $(this).val();
        
        if (val === '') return;

        let count = parseInt(val);
        if (count > maxBuy) {
            alert("최대 구매 수량(" + maxBuy + "개)을 초과할 수 없습니다.");
            count = maxBuy;
            $(this).val(count);
        } else if (count < 1) {
            count = 1;
            $(this).val(count);
        }

        updateItemPrice($item);
    });

    // 5. 포커스 아웃 시 빈값 방지
    $(document).on('blur', '.input-count', function() {
        const $item = $(this).closest('.cart-buy-item');
        if ($(this).val() === '' || parseInt($(this).val()) < 1) {
            $(this).val(1);
            updateItemPrice($item);
        }
    });

    // --- 장바구니 관리 기능 ---

    // 선택삭제
    $('.btn-cart-util:contains("선택삭제")').on('click', function() {
        const $checkedItems = $('.cart-check:checked');
        if ($checkedItems.length === 0) {
            alert("삭제할 상품을 선택해 주세요.");
            return;
        }
        if (confirm("선택한 상품을 삭제하시겠습니까?")) {
            $checkedItems.closest('.cart-buy-item').remove();
            checkEmptyCart();
        }
    });

    // 비우기
    $('.btn-cart-util:contains("비우기")').on('click', function() {
        if ($('.cart-buy-item').length === 0) return;
        if (confirm("장바구니를 모두 비우시겠습니까?")) {
            $('.cart-item-list').empty();
            checkEmptyCart();
        }
    });

    // 개별 X 버튼 삭제
    $(document).on('click', '.btn-remove', function() {
        $(this).closest('.cart-buy-item').remove();
        checkEmptyCart();
    });

    function checkEmptyCart() {
        if ($('.cart-item-list').children('.cart-buy-item').length === 0) {
            $('.cart-item-list').html('<div class="buy-placeholder">장바구니에 담긴 상품이 없습니다.</div>');
        }
    }

    // 구매하기 버튼 클릭 시
    $('.btn-buy-submit').on('click', function() {
        const orderData = []; // 데이터를 담을 배열

        // 체크된 상품들만 순회
        $('.cart-check:checked').each(function() {
            const $item = $(this).closest('.cart-buy-item');
            
            // 데이터 수집
            const itemInfo = {
                product_code: $item.find('.product-code').val(), // 상품 코드
                quantity: parseInt($item.find('.input-count').val()) // 수정된 수량
            };

            orderData.push(itemInfo);
        });

        // 선택된 상품이 없는 경우 예외 처리
        if (orderData.length === 0) {
            alert("구매할 상품을 선택해 주세요.");
            return;
        }

        // AJAX 전송 예시 (작업하실 부분의 참고용)
        console.log("전송할 데이터:", orderData); // JSON 구조 확인용
        
        /* $.ajax({
            url: '/api/order_process.php',
            type: 'POST',
            contentType: 'application/json', // JSON 전송 시 필수
            data: JSON.stringify(orderData), // 배열을 JSON 문자열로 변환
            success: function(response) {
                alert("주문 처리가 완료되었습니다.");
            }
        });
        */
    });
});

