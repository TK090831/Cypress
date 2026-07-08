# Task Manager - Cypress End-to-End Test

## Overview

โปรเจกต์นี้เป็นชุดทดสอบอัตโนมัติ (End-to-End Testing) สำหรับระบบ **Task Manager** โดยใช้ **Cypress** เพื่อจำลองการใช้งานของผู้ใช้จริง ตั้งแต่การเข้าสู่ระบบ การจัดการรายการงาน ไปจนถึงการแก้ไขและลบงาน

ชุดทดสอบครอบคลุมทั้งการทดสอบด้าน Functional Testing และ UI Validation เพื่อให้มั่นใจว่าฟังก์ชันหลักของระบบสามารถทำงานได้ถูกต้อง

---

# Test Scope

ชุดทดสอบแบ่งออกเป็น 4 Scenarios หลัก

| Scenario | รายละเอียด |
|-----------|------------|
| SC001 | Login |
| SC002 | My Tasks |
| SC003 | Create Task |
| SC004 | Task Detail |

ครอบคลุมทั้ง

- Positive Test
- Negative Test
- UI Validation
- CRUD Operation
- Filter & Sort
- Empty State

---

# Design Concept

## 1. Scenario-based Testing

Test Script ถูกแบ่งออกเป็นหลาย `describe()` ตาม Feature ของระบบ

- SC001 Login
- SC002 My Tasks
- SC003 Create Task
- SC004 Task Detail

---

## 2. Reusable Login Function

สร้าง Helper Function

```javascript
loginSuccess()
```

สำหรับ Login ก่อนเริ่ม Test

ช่วยลดการเขียนโค้ดซ้ำ

และใช้ร่วมกันใน

- SC002
- SC003
- SC004

---

## 3. Test Isolation

ทุก Scenario ใช้

```javascript
beforeEach()
```

เพื่อเตรียมสภาพแวดล้อมก่อนเริ่ม Test

ข้อดีคือ

- Test Case ไม่ขึ้นต่อกัน
- สามารถรันแยกได้
- ลดผลกระทบจาก Test ก่อนหน้า

---

## 4. Positive & Negative Testing

ชุดทดสอบครอบคลุมทั้ง

### Positive

- Login สำเร็จ
- Create Task
- Edit Task
- Delete Task
- Filter
- Sort

### Negative

- Email ไม่ถูกต้อง
- Password ไม่ถูกต้อง
- ไม่กรอกข้อมูล
- Empty State

---

## 5. Dynamic Test Data

ใช้

```javascript
Date.now()
```

สร้างชื่อ Task ใหม่ทุกครั้ง เช่น

```text
New Task Automated 1751853211
```

ช่วยลดปัญหาข้อมูลซ้ำระหว่างการทดสอบ

---

## 6. UI Validation

ตรวจสอบองค์ประกอบของหน้าจอ เช่น

- Button
- Input
- Dropdown
- Task Card
- Detail Page
- Empty State

โดยใช้คำสั่ง

```javascript
should('be.visible')
```

และ

```javascript
contains()
```

---

## 7. Flexible Element Selector

ใช้ Selector หลายรูปแบบ เช่น

```javascript
input[type="email"]

input[placeholder*="email"]

[role="combobox"]
```

เพื่อให้ Test Script สามารถทำงานได้ แม้ UI มีการเปลี่ยนแปลงเล็กน้อย

---

## 8. API Mocking

ใช้

```javascript
cy.intercept()
```

จำลอง API Response

สำหรับทดสอบ

- Empty State

โดยไม่จำเป็นต้องแก้ไขข้อมูลจริงในระบบ

---

# How to Run Test

## 1. Install Node.js

ตรวจสอบเวอร์ชัน

```bash
node -v
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Install Cypress (หากยังไม่ได้ติดตั้ง)

```bash
npm install cypress --save-dev
```

---

## 4. เปิด Cypress

```bash
npx cypress open
```

เลือก

```
E2E Testing
```

จากนั้นเลือกไฟล์

```
task-manager.cy.js
```

---

## 5. Run แบบ Headless

```bash
npx cypress run
```

---

## 6. Run เฉพาะไฟล์

```bash
npx cypress run --spec cypress/e2e/task-manager.cy.js
```

---

## 7. Run ด้วย Chrome

```bash
npx cypress run --browser chrome
```

---

# Assumptions

ชุดทดสอบนี้มีข้อสมมติฐานดังต่อไปนี้

### 1. ระบบสามารถเข้าถึงได้

Application ต้องสามารถเข้าถึงได้ที่

```
https://app-testing-sea-02.azurewebsites.net/login
```

---

### 2. Test Account พร้อมใช้งาน

ใช้บัญชี

```
Email :
admin@example.com

Password :
admin123
```

และสามารถ Login ได้ตลอดการทดสอบ

---

### 3. UI Element ไม่เปลี่ยนแปลง

Element ต่าง ๆ เช่น

- Button
- Input
- Dropdown
- Card
- Label

ยังคงใช้ชื่อหรือ Selector เดิม

---

### 4. Database พร้อมใช้งาน

ระบบสามารถ

- Create
- Read
- Update
- Delete

Task ได้ตามปกติ

---

### 5. สิทธิ์ของผู้ใช้

บัญชีที่ใช้ทดสอบมีสิทธิ์

- สร้าง Task
- แก้ไข Task
- ลบ Task
- Logout

---

### 6. ไม่มี Rate Limiting

สามารถ Login และสร้างข้อมูลซ้ำหลายครั้งได้

---

### 7. การสร้างข้อมูลไม่กระทบผู้ใช้งานจริง

Task ที่สร้างขึ้นเพื่อการทดสอบสามารถลบออกได้ และไม่กระทบต่อข้อมูลสำคัญของระบบ

---

### 8. Empty State ใช้ API Mock

การทดสอบกรณีไม่มีข้อมูลใช้

```javascript
cy.intercept()
```

จำลองผลลัพธ์จาก API

ดังนั้นจึงไม่จำเป็นต้องลบข้อมูลจริงออกจากฐานข้อมูล

---

### 9. Browser ที่รองรับ

ทดสอบบน Browser ที่ Cypress รองรับ เช่น

- Chrome
- Microsoft Edge
- Electron

---

### 10. การเชื่อมต่อเครือข่าย

สมมติว่าระบบมีการเชื่อมต่ออินเทอร์เน็ตที่เสถียร เพื่อป้องกันผลการทดสอบผิดพลาดจากปัญหาเครือข่าย

---

# Expected Result

เมื่อรัน Test Script สำเร็จ Cypress จะรายงานผลการทดสอบของแต่ละ Test Case พร้อมแสดงสถานะ Passed/Failed และสามารถสร้าง Screenshot หรือ Video (หากเปิดใช้งาน) เพื่อช่วยในการวิเคราะห์กรณีเกิดข้อผิดพลาด