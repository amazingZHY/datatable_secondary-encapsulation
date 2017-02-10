/**
 * Sometimes for quick navigation, it can be useful to allow an end user to
 * enter which page they wish to jump to manually. This paging control uses a
 * text input box to accept new paging numbers (arrow keys are also allowed
 * for), and four standard navigation buttons are also presented to the end
 * user.
 *
 *  @name Navigation with text input
 *  @summary Shows an input element into which the user can type a page number
 *  @author [Allan Jardine](http://sprymedia.co.uk)
 *  @author [Gordey Doronin](http://github.com/GDoronin)
 *
 *  @example
 *    $(document).ready(function() {
 *        $('#example').dataTable( {
 *            "pagingType": "input"
 *        } );
 *    } );
 */

(function ($) {
    function calcDisableClasses(oSettings) {
        var start = oSettings._iDisplayStart;
        var length = oSettings._iDisplayLength;
        var visibleRecords = oSettings.fnRecordsDisplay();
        var all = length === -1;

        // Gordey Doronin: Re-used this code from main jQuery.dataTables source code. To be consistent.
        var page = all ? 0 : Math.ceil(start / length);
        var pages = all ? 1 : Math.ceil(visibleRecords / length);

        var disableFirstPrevClass = (page > 0 ? '' : oSettings.oClasses.sPageButtonDisabled);
        var disableNextLastClass = (page < pages - 1 ? '' : oSettings.oClasses.sPageButtonDisabled);

        return {
            'first': disableFirstPrevClass,
            'previous': disableFirstPrevClass,
            'next': disableNextLastClass,
            'last': disableNextLastClass
        };
    }

    function calcCurrentPage(oSettings) {
        return Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
    }

    function calcPages(oSettings) {
        return Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength);
    }

    var firstClassName = 'first';
    var previousClassName = 'previous';
    var inputClassName = 'input';
    var nextClassName = 'next';
    var lastClassName = 'last';

    var paginateClassName = 'pagination';
    var paginateOfClassName = 'paginate_button';
    var paginateInputClassName = 'paginate_button';

    $.fn.dataTableExt.oPagination.input = {
        'fnInit': function (oSettings, nPaging, fnCallbackDraw) {
            var language = oSettings.oLanguage.oPaginate,
                classes = oSettings.oClasses,
                first = verification._isNull(language.sFirst) ? firstClassName : language.sFirst,
                last = verification._isNull(language.sLast) ? lastClassName : language.sLast,
                table = $("#"+oSettings.sTableId.split("_table")[0]);
            $(nPaging).append(
                '<ul class="'+paginateClassName+'">' +
                    '<li class="'+ firstClassName + ' ' + classes.sPageButton +'" style="list-style: none;">' +
                        '<a href="javascript:void(0)" id="'+ oSettings.sTableId + '_' + firstClassName +'">'+ first +'</a>' +
                    '</li>'+
                    '<li class="'+ previousClassName + ' ' + classes.sPageButton +'" style="list-style: none;">' +
                        '<a href="javascript:void(0)" id="'+ oSettings.sTableId + '_' + previousClassName +'">'+ language.sPrevious +'</a>' +
                    '</li>' +
                    '<li class="'+ paginateInputClassName + ' ' + classes.sPageButton +'" style="list-style: none;">' +
                        '<input class="paginate_input" type="text" id="'+ oSettings.sTableId + '_'+ inputClassName +'">' +
                    '</li>'+
                    '<li class="'+ nextClassName + ' ' + classes.sPageButton +'" style="list-style: none;">' +
                        '<a href="javascript:void(0)" id="'+ oSettings.sTableId + '_' + nextClassName +'">'+ language.sNext +'</a>' +
                    '</li>'+
                    '<li class="'+ lastClassName + ' ' + classes.sPageButton +'" style="list-style: none;">' +
                        '<a href="javascript:void(0)" id="'+ oSettings.sTableId + '_' + lastClassName +'">'+ last +'</a>' +
                    '</li>'+
                '</ul>'
            );

            table.on('click','#'+oSettings.sTableId + '_' + firstClassName,function(){
                var iCurrentPage = calcCurrentPage(oSettings);
                if (iCurrentPage !== 1) {
                    oSettings.oApi._fnPageChange(oSettings, 'first');
                    fnCallbackDraw(oSettings);
                }
            });

            table.on('click',"#"+ oSettings.sTableId + '_' + previousClassName,function() {
                var iCurrentPage = calcCurrentPage(oSettings);
                if (iCurrentPage !== 1) {
                    oSettings.oApi._fnPageChange(oSettings, 'previous');
                    fnCallbackDraw(oSettings);
                }
            });

            table.on('click',"#"+ oSettings.sTableId + '_' + nextClassName,function() {
                var iCurrentPage = calcCurrentPage(oSettings);
                if (iCurrentPage !== calcPages(oSettings)) {
                    oSettings.oApi._fnPageChange(oSettings, 'next');
                    fnCallbackDraw(oSettings);
                }
            });

            table.on('click',"#"+ oSettings.sTableId + '_' + lastClassName,function(){
                var iCurrentPage = calcCurrentPage(oSettings);
                if (iCurrentPage !== calcPages(oSettings)) {
                    oSettings.oApi._fnPageChange(oSettings, 'last');
                    fnCallbackDraw(oSettings);
                }
            });

            table.on('keyup',"#"+ oSettings.sTableId + '_'+ inputClassName,function (e) {
                // 38 = up arrow, 39 = right arrow
                if (e.which === 38 || e.which === 39) {
                    this.value++;
                }
                // 37 = left arrow, 40 = down arrow
                else if ((e.which === 37 || e.which === 40) && this.value > 1) {
                    this.value--;
                }

                if (this.value === '' || this.value.match(/[^0-9]/)) {
                    /* Nothing entered or non-numeric character */
                    this.value = this.value.replace(/[^\d]/g, ''); // don't even allow anything but digits
                    /*var iCurrentPage = calcCurrentPage(oSettings);
                    $(this).blur(function(){
                        this.value = iCurrentPage;
                    });*/
                    return;
                }

                var iNewStart = oSettings._iDisplayLength * (this.value - 1);
                if (iNewStart < 0) {
                    iNewStart = 0;
                }
                if (iNewStart >= oSettings.fnRecordsDisplay()) {
                    iNewStart = (Math.ceil((oSettings.fnRecordsDisplay() - 1) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength;
                }

                oSettings._iDisplayStart = iNewStart;
                fnCallbackDraw(oSettings);
            });

            // Take the brutal approach to cancelling text selection.
            $('a', nPaging).bind('mousedown', function () { return false; });
            $('a', nPaging).bind('selectstart', function() { return false; });

            // If we can't page anyway, might as well not show it.
            var iPages = calcPages(oSettings);
            if (iPages <= 1) {
                $(nPaging).hide();
            }
        },
        'fnUpdate': function (oSettings) {
            if (!oSettings.aanFeatures.p) {
                return;
            }

            var iPages = calcPages(oSettings);
            var iCurrentPage = calcCurrentPage(oSettings);

            var an = oSettings.aanFeatures.p;
            if (iPages <= 1) // hide paging when we can't page
            {
                $(an).hide();
                return;
            }

            var disableClasses = calcDisableClasses(oSettings);

            $(an).show();

            // Enable/Disable `first` button.
            $('.' + firstClassName)
                .removeClass(oSettings.oClasses.sPageButtonDisabled)
                .addClass(disableClasses[firstClassName]);

            // Enable/Disable `prev` button.
            $('.'+ previousClassName)
                .removeClass(oSettings.oClasses.sPageButtonDisabled)
                .addClass(disableClasses[previousClassName]);

            // Enable/Disable `next` button.
            $('.'+ nextClassName)
                .removeClass(oSettings.oClasses.sPageButtonDisabled)
                .addClass(disableClasses[nextClassName]);

            // Enable/Disable `last` button.
            $('.' + lastClassName)
                .removeClass(oSettings.oClasses.sPageButtonDisabled)
                .addClass(disableClasses[lastClassName]);

            // Paginate of N pages text
            $(an).children('.' + paginateOfClassName).html(' of ' + iPages);

            // Current page numer input value
            //$("#"+oSettings.sTableId + '_'+ inputClassName).val(iCurrentPage);
            $(".paginate_input").val(iCurrentPage);
        }
    };
})(jQuery);
