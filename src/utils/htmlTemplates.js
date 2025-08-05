export const signUpTemp = (link) => `<!DOCTYPE html>
<html lang="ar" dir="rtl" style="font-family: Tahoma, Arial, sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>تأكيد حسابك</title>
    <style>
      body {
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        background: #fff;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        text-align: center;
        direction: rtl;
      }
      .btn {
        background-color: #28a745;
        color: white;
        padding: 12px 25px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 16px;
        display: inline-block;
        margin-top: 20px;
      }
      .footer {
        font-size: 12px;
        color: #999;
        margin-top: 40px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>مرحبًا بك!</h2>
      <p>شكرًا لتسجيلك. اضغط الزر بالأسفل لتأكيد بريدك الإلكتروني.</p>
      <a href="${link}" class="btn">تأكيد البريد الإلكتروني</a>
      <div class="footer">
        إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.
      </div>
    </div>
  </body>
</html>`;

export const resetPasswordTemp = (code) => `<!DOCTYPE html>
<html lang="ar" dir="rtl" style="font-family: Tahoma, Arial, sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>إعادة تعيين كلمة المرور</title>
    <style>
      body {
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        background: #fff;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        text-align: center;
        direction: rtl;
      }
      .code-box {
        background-color: #eee;
        padding: 15px;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 4px;
        border-radius: 6px;
        display: inline-block;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        color: #999;
        margin-top: 40px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>إعادة تعيين كلمة المرور</h2>
      <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك.</p>
      <p>الكود الخاص بك هو:</p>
      <div class="code-box">${code}</div>
      <p>استخدم هذا الكود داخل التطبيق لإعادة تعيين كلمة المرور.</p>
      <div class="footer">
        إذا لم تطلب هذا الإجراء، يمكنك تجاهل هذه الرسالة.
      </div>
    </div>
  </body>
</html>`;
