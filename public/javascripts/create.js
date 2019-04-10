//create pages
function createPages(shop) {
    console.log('create page for ' + shop);
    $.ajax({
        url: '/shopify/app/create-page?shop=' + shop,
        type: 'Post',
        success: function (result) {
            console.log(result);
        }
    });
}

function createTheme(shop) {
    console.log('create page for ' + shop);
    $.ajax({
        url: '/shopify/app/create-theme?shop=' + shop,
        type: 'Post',
        success: function (result) {
            console.log(result);
        }
    });
}

//view pages
function view(shop) {

    $.ajax({
        url: '/shopify/app/pages?shop=' + shop,
        type: 'Get',
        success: function (result) {
            console.log(result);
            
        }
    });
}