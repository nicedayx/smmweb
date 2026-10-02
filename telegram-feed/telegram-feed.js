<script>
(function () {

    'use strict';


    /* =================================================
       CONFIG
       ================================================= */

    const WORKER_URL =
        'https://smmsuper-telegram-feed.smm-api-worker.workers.dev/';


    const CHANNEL_URL =
        'https://t.me/smmsuperio';


    const CHANNEL_USERNAME =
        '@smmsuperio';



    /* =================================================
       INIT
       ================================================= */

    function initTelegramFeed() {


        /*
         * ป้องกันสร้างซ้ำ
         */

        if (
            document.getElementById(
                'smmsuper-telegram-feed'
            )
        ) {
            return;
        }



        /*
         * Card เป้าหมายจาก HTML ของคุณ
         */

        const card =
            document.querySelector(
                '#block_79 ' +
                '.component_content_card' +
                '.component_content_button ' +
                '.card'
            );


        if (!card) {
            return;
        }



        /*
         * หัวข้อ
         *
         * "บริการของเรา แบ่งออกเป็น3กลุ่มหลัก"
         */

        const contentTitle =
            card.querySelector(
                '.new-order__content-title'
            );


        /*
         * ถ้าหา Title ไม่เจอ
         * ยังไม่ Inject
         */

        if (!contentTitle) {
            return;
        }



        /* =================================================
           CREATE WIDGET
           ================================================= */

        const widget =
            document.createElement('div');


        widget.id =
            'smmsuper-telegram-feed';



        widget.innerHTML = `

            <!-- ========================================
                 HEADER
                 ======================================== -->

            <div class="stf-header">


                <div class="stf-channel">


                    <div class="stf-icon">

                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >

                            <path
                                d="
                                M21.7 3.4
                                18.5 19
                                c-.24 1.1-.88 1.37-1.78.85
                                l-4.88-3.6
                                -2.35 2.26
                                c-.26.26-.48.48-.98.48
                                l.35-4.97
                                9.05-8.18
                                c.39-.35-.09-.55-.61-.2
                                L6.11 12.69
                                1.3 11.18
                                c-1.05-.33-1.07-1.05.22-1.55
                                L20.3 2.39
                                c.87-.32 1.63.2 1.4 1.01Z
                                "
                            />

                        </svg>

                    </div>



                    <div class="stf-info">


                        <div class="stf-title">

                            อัปเดตจาก Telegram

                            <span
                                class="stf-status"
                                aria-hidden="true">
                            </span>

                        </div>


                        <div class="stf-user">

                            ${CHANNEL_USERNAME}

                        </div>


                    </div>


                </div>



                <!-- JOIN BUTTON -->

                <a
                    class="stf-join"
                    href="${CHANNEL_URL}"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="เข้าร่วม Telegram Channel"
                >

                    <span class="stf-join-text">
                        เข้าร่วม
                    </span>


                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >

                        <path d="M15 3h6v6"></path>

                        <path d="M10 14 21 3"></path>

                        <path
                            d="
                            M18 13v6
                            a2 2 0 0 1-2 2
                            H5
                            a2 2 0 0 1-2-2
                            V8
                            a2 2 0 0 1 2-2
                            h6
                            ">
                        </path>

                    </svg>

                </a>


            </div>



            <!-- ========================================
                 FRAME
                 ======================================== -->

            <div class="stf-frame-wrap">


                <!-- ==============================
                     LOADING
                     ============================== -->

                <div class="stf-loader">


                    <div class="stf-loader-head">


                        <div class="stf-loader-logo">

                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >

                                <path
                                    d="
                                    M21.7 3.4
                                    18.5 19
                                    c-.24 1.1-.88 1.37-1.78.85
                                    l-4.88-3.6
                                    -2.35 2.26
                                    c-.26.26-.48.48-.98.48
                                    l.35-4.97
                                    9.05-8.18
                                    c.39-.35-.09-.55-.61-.2
                                    L6.11 12.69
                                    1.3 11.18
                                    c-1.05-.33-1.07-1.05.22-1.55
                                    L20.3 2.39
                                    c.87-.32 1.63.2 1.4 1.01Z
                                    "
                                />

                            </svg>

                        </div>



                        <span class="stf-loading-text">

                            กำลังโหลดอัปเดตล่าสุด...

                        </span>


                    </div>



                    <!-- ==============================
                         SKELETON POST 1
                         ============================== -->

                    <div class="stf-skeleton">


                        <div class="stf-skeleton-post">


                            <div class="stf-sk-row">

                                <div
                                    class="stf-sk-avatar">
                                </div>

                                <div
                                    class="stf-sk-user">
                                </div>

                            </div>


                            <div
                                class="stf-sk-line line-1">
                            </div>

                            <div
                                class="stf-sk-line line-2">
                            </div>

                            <div
                                class="stf-sk-line line-3">
                            </div>


                        </div>



                        <!-- ==============================
                             SKELETON POST 2
                             ============================== -->

                        <div class="stf-skeleton-post">


                            <div class="stf-sk-row">

                                <div
                                    class="stf-sk-avatar">
                                </div>

                                <div
                                    class="stf-sk-user">
                                </div>

                            </div>


                            <div
                                class="stf-sk-line line-1">
                            </div>

                            <div
                                class="stf-sk-line line-2">
                            </div>

                            <div
                                class="stf-sk-line line-3">
                            </div>


                        </div>



                        <!-- ==============================
                             SKELETON POST 3
                             ============================== -->

                        <div class="stf-skeleton-post">


                            <div class="stf-sk-row">

                                <div
                                    class="stf-sk-avatar">
                                </div>

                                <div
                                    class="stf-sk-user">
                                </div>

                            </div>


                            <div
                                class="stf-sk-line line-1">
                            </div>

                            <div
                                class="stf-sk-line line-2">
                            </div>

                            <div
                                class="stf-sk-line line-3">
                            </div>


                        </div>


                    </div>



                    <!-- ==============================
                         RETRY
                         ============================== -->

                    <button
                        type="button"
                        class="stf-retry"
                    >

                        โหลดใหม่

                    </button>


                </div>



                <!-- =================================
                     TELEGRAM IFRAME
                     ================================= -->

                <iframe

                    class="stf-frame"

                    src="${WORKER_URL}"

                    title="SMMSUPER Telegram Channel"

                    loading="eager"

                    scrolling="yes"

                ></iframe>


            </div>

        `;



        /* =================================================
           INSERT POSITION

           Telegram อยู่ก่อน:

           "บริการของเรา แบ่งออกเป็น3กลุ่มหลัก"
           ================================================= */

        card.insertBefore(
            widget,
            contentTitle
        );



        /* =================================================
           ELEMENTS
           ================================================= */

        const iframe =
            widget.querySelector(
                '.stf-frame'
            );


        const loadingText =
            widget.querySelector(
                '.stf-loading-text'
            );


        const retryButton =
            widget.querySelector(
                '.stf-retry'
            );


        let loaded = false;



        /* =================================================
           IFRAME LOAD
           ================================================= */

        iframe.addEventListener(
            'load',
            function () {

                loaded = true;


                widget.classList.remove(
                    'stf-slow'
                );


                /*
                 * รอให้ Telegram Render เล็กน้อย
                 * แล้ว Fade เข้า
                 */

                window.setTimeout(
                    function () {

                        widget.classList.add(
                            'stf-loaded'
                        );

                    },
                    180
                );

            }
        );



        /* =================================================
           4 SECONDS
           ================================================= */

        window.setTimeout(
            function () {

                if (loaded) {
                    return;
                }


                loadingText.textContent =
                    'กำลังเชื่อมต่อ Telegram...';

            },
            4000
        );



        /* =================================================
           9 SECONDS
           ================================================= */

        window.setTimeout(
            function () {

                if (loaded) {
                    return;
                }


                widget.classList.add(
                    'stf-slow'
                );


                loadingText.textContent =
                    'ใช้เวลาโหลดนานกว่าปกติ';

            },
            9000
        );



        /* =================================================
           RETRY
           ================================================= */

        retryButton.addEventListener(
            'click',
            function () {

                loaded = false;


                widget.classList.remove(
                    'stf-loaded',
                    'stf-slow'
                );


                loadingText.textContent =
                    'กำลังโหลดอัปเดตล่าสุด...';



                /*
                 * Cache Bust
                 */

                const separator =
                    WORKER_URL.includes('?')
                        ? '&'
                        : '?';


                iframe.src =
                    WORKER_URL +
                    separator +
                    'reload=' +
                    Date.now();

            }
        );

    }



    /* =================================================
       CMS DOM READY
       ================================================= */

    if (
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            initTelegramFeed
        );

    } else {

        initTelegramFeed();

    }



    /* =================================================
       CMS DELAYED RENDER FALLBACK
       ================================================= */

    window.setTimeout(
        initTelegramFeed,
        300
    );


    window.setTimeout(
        initTelegramFeed,
        800
    );


    window.setTimeout(
        initTelegramFeed,
        1500
    );


    window.setTimeout(
        initTelegramFeed,
        3000
    );


})();
</script>