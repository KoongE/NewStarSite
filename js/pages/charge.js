$(document).ready(function() {
    let currentAmount = 0;
    const maxChargeAmount = parseInt($('#max-charge-amount').val()) || 1000000;

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function unformatNumber(str) {
        return parseInt(str.toString().replace(/[^0-9]/g, '')) || 0;
    }

    function roundToTen(num) {
        return Math.round(num / 10) * 10;
    }

    // 금액 버튼 클릭
    $('.btn-amount').on('click', function() {
        const selectedAmount = unformatNumber($(this).text());
        currentAmount += selectedAmount;

        if (currentAmount > maxChargeAmount) {
            alert("최대 충전 가능 금액은 " + formatNumber(maxChargeAmount) + "입니다.");
            currentAmount = maxChargeAmount;
        }

        $('.input-amount').val(formatNumber(currentAmount));
    });

    // 결제 수단 토글
    $('.charge-right-group .btn-method').on('click', function() {
        $('.charge-right-group .btn-method').removeClass('on').addClass('off');
        $(this).removeClass('off').addClass('on');
    });

    // 초기화 버튼
    $('.btn-action-off').on('click', function() {
        currentAmount = 0;
        $('.input-amount').val(formatNumber(currentAmount));
        $('.btn-amount').removeClass('on').addClass('off');
    });

    // --- 추가 및 수정된 로직 ---

    // 1. 포커스 시 전체 선택 (추가됨)
    $('.input-amount').on('focus', function() {
        // 원활한 선택을 위해 setTimeout을 살짝 주거나 select()를 바로 호출합니다.
        $(this).select();
    });

    // 2. 입력 중 한도 체크
    $('.input-amount').on('keyup input', function() {
        let val = unformatNumber($(this).val());
        
        if (val > maxChargeAmount) {
            alert("최대 충전 가능 금액은 " + formatNumber(maxChargeAmount) + "입니다.");
            val = maxChargeAmount;
        }
        
        $(this).val(formatNumber(val));
    });

    // 3. 포커스 잃었을 때 반올림 (기존 유지)
    $('.input-amount').on('blur', function() {
        let val = unformatNumber($(this).val());
        
        if (val > 0) {
            val = roundToTen(val);
            if (val > maxChargeAmount) {
                val = maxChargeAmount;
            }
        }
        
        currentAmount = val;
        $(this).val(formatNumber(currentAmount));
    });
});