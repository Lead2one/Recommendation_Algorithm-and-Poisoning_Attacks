// 当文档加载完毕时绑定点击事件
document.addEventListener('DOMContentLoaded', function() {
    var moreToggle = document.getElementById('moreToggle');

    moreToggle.addEventListener('click', function() {
        // 检查当前背景图像是否已经是新图像，如果是，则切换回原图像
        if (this.style.backgroundImage === 'url("./static/resource/image/customize_F.svg")') {
            this.style.backgroundImage = 'url("./static/resource/image/customize.svg")';
        } else {
            // 否则，更换为新的背景图像
            this.style.backgroundImage = 'url("./static/resource/image/customize_F.svg")';
        }
    });
});
const moreOptions = document.getElementById('moreOptions');
document.getElementById('moreToggle').addEventListener('click', function (event) {
    moreOptions.classList.toggle('active');
});