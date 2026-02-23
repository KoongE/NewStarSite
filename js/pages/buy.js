$(document).ready(function() {
    // 1. 초기 상태 설정
    $('.buy-amount-container').hide();
    $('.buy-placeholder').show();

    let unitPrice = 0;
    // hidden input에서 최대 구매 수량 가져오기 (기본값 10)
    const maxCount = parseInt($('#max-buy-count').val()) || 10;

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
    }

    // 2. 금액 버튼(btn-method) 클릭
    $('.btn-method').on('click', function() {
        const $this = $(this);
        $('.btn-method').removeClass('on').addClass('off');
        $this.removeClass('off').addClass('on');

        const selectedTitle = $this.find('.m-title').text();
        const priceText = $this.find('.m-price').text().replace(/[^0-9]/g, '');
        unitPrice = parseInt(priceText);

        const brandName = $('.brand-name').text();
        $('.target-name').text(brandName + ' ' + selectedTitle + '권');
        
        $('.input-count').val(1);
        $('.total-price-text').text(formatNumber(unitPrice));

        $('.buy-placeholder').hide();
        $('.buy-amount-container').stop().fadeIn(300);
    });

    // 3. 수량 조절 버튼 (+) : 클릭 시 즉시 한도 체크
    $('.btn-plus').on('click', function() {
        let count = parseInt($('.input-count').val()) || 0;
        
        if (count >= maxCount) {
            alert("1회 최대 구매 가능한 수량은 " + maxCount + "개입니다.");
            return false;
        }

        count++;
        $('.input-count').val(count);
        updateTotalPrice(count);
    });

    // 4. 수량 조절 버튼 (-)
    $('.btn-minus').on('click', function() {
        let count = parseInt($('.input-count').val()) || 1;
        if (count > 1) {
            count--;
            $('.input-count').val(count);
            updateTotalPrice(count);
        }
    });

    // 5. 직접 입력 시 대응 (개선된 로직)
    $('.input-count').on('keyup input', function() {
        let val = $(this).val();
        
        // 빈 값일 때는 계산하지 않고 대기 (사용자가 지우고 새로 쓰는 중일 수 있음)
        if (val === '') return;

        let count = parseInt(val);
        
        // 최대 수량 초과 시에만 alert 발생 및 한도 고정
        if (count > maxCount) {
            alert("1회 최대 구매 가능한 수량은 " + maxCount + "개입니다.");
            count = maxCount;
            $(this).val(count);
        }
        
        // 0 이하 입력 시 처리 (보통 1로 고정)
        if (count < 1) {
            count = 1;
            $(this).val(count);
        }

        updateTotalPrice(count);
    });

    // 포커스를 잃었을 때(blur) 빈 값이면 1로 채워주는 안전장치
    $('.input-count').on('blur', function() {
        if ($(this).val() === '' || parseInt($(this).val()) < 1) {
            $(this).val(1);
            updateTotalPrice(1);
        }
    });

    function updateTotalPrice(count) {
        const total = unitPrice * count;
        $('.total-price-text').text(formatNumber(total));
    }

    // 6. 삭제 버튼(btn-remove) 클릭
    $('.btn-remove').on('click', function() {
        $('.buy-amount-container').hide();
        $('.buy-placeholder').fadeIn(200);
        $('.btn-method').removeClass('on').addClass('off');
    });
});