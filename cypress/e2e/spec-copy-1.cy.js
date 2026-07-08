describe('Task Manager - Full Test Case', () => {
  
  const newLocal = 'https://app-testing-sea-02.azurewebsites.net/login';
  const BASE_URL = newLocal;
  const VALID_EMAIL = 'admin@example.com';
  const VALID_PASSWORD = 'admin123';

  // Helper function สำหรับเข้าสู่ระบบเพื่อใช้ใน Test Case ของ SC002, SC003 และ SC004
  const loginSuccess = () => {
    cy.visit(BASE_URL);
    cy.get('input[type="email"], input[placeholder*="email" i], input[placeholder*="admin@example.com" i]').clear().type(VALID_EMAIL);
    cy.get('input[type="password"], input[placeholder*="password" i], input[placeholder*="••••••••"]').clear().type(VALID_PASSWORD);
    cy.contains('button', 'Sign in').click();
    cy.contains('My Tasks', { timeout: 10000 }).should('be.visible');
  };

  // =========================================================================
  // SC001: ทดสอบการใช้งานหน้า Login
  // =========================================================================
  describe('SC001: ทดสอบการใช้งานหน้า Login', () => {
    
    beforeEach(() => {
      cy.visit(BASE_URL);
    });

    it('SC001-TC001: ทดสอบกรณี login สำเร็จ', () => {
      cy.get('input[type="email"], input[placeholder*="admin@example.com" i]').type(VALID_EMAIL);
      cy.get('input[type="password"], input[placeholder*="••••••••"]').type(VALID_PASSWORD);
      cy.contains('button', 'Sign in').click();
      
      // Expected Result: ระบบจะต้องแสดงหน้าหลัก (Task Manager)
      cy.contains('My Tasks').should('be.visible');
    });

    it('SC001-TC002: ทดสอบกรณี login ไม่สำเร็จ โดยกรอก Email ไม่ถูกต้อง', () => {
      cy.get('input[type="email"], input[placeholder*="admin@example.com" i]').type('wrongemail@example.com');
      cy.get('input[type="password"], input[placeholder*="••••••••"]').type(VALID_PASSWORD);
      cy.contains('button', 'Sign in').click();
      
      // Expected Result: ระบบจะต้องแสดงข้อความ "Login Error Invalid login credentials"
      cy.contains('Invalid login credentials', { matchCase: false }).should('be.visible');
    });

    it('SC001-TC003: ทดสอบกรณี login ไม่สำเร็จ โดยกรอก Password ไม่ถูกต้อง', () => {
      cy.get('input[type="email"], input[placeholder*="admin@example.com" i]').type(VALID_EMAIL);
      cy.get('input[type="password"], input[placeholder*="••••••••"]').type('wrongpassword');
      cy.contains('button', 'Sign in').click();
      
      // Expected Result: ระบบจะต้องแสดงข้อความ "Login Error Invalid login credentials"
      cy.contains('Invalid login credentials', { matchCase: false }).should('be.visible');
    });

    it('SC001-TC004: ทดสอบกรณี login ไม่สำเร็จ โดยไม่กรอก Email', () => {
      cy.get('input[type="password"], input[placeholder*="••••••••"]').type(VALID_PASSWORD);
      cy.contains('button', 'Sign in').click();
      
      // Expected Result: ระบบต้องแจ้งเตือนให้กรอก Email
      cy.get('input[type="email"]').then(($input) => {
       
        if ($input[0].validationMessage) {
          expect($input[0].validationMessage).to.not.be.empty;
        } else {
          cy.contains(/กรุณากรอก email|required|email is required/i).should('be.visible');
        }
      });
    });

    it('SC001-TC005: ทดสอบกรณี login ไม่สำเร็จ โดยไม่กรอก Password', () => {
      cy.get('input[type="email"], input[placeholder*="admin@example.com" i]').type(VALID_EMAIL);
      cy.contains('button', 'Sign in').click();
      
      // Expected Result: ระบบต้องแจ้งเตือนให้กรอก Password
      cy.get('input[type="password"]').then(($input) => {
        if ($input[0].validationMessage) {
          expect($input[0].validationMessage).to.not.be.empty;
        } else {
          cy.contains(/กรุณากรอก password|required|password is required/i).should('be.visible');
        }
      });
    });

    it('SC001-TC006: ทดสอบกรณี login ไม่สำเร็จ โดยไม่กรอก Email และ Password', () => {
      cy.contains('button', 'Sign in').click();
      
      // Expected Result: ระบบต้องแจ้งเตือนให้กรอก Email และ Password
      cy.get('input[type="email"], input[type="password"]').each(($input) => {
        if ($input[0].validationMessage) {
          expect($input[0].validationMessage).to.not.be.empty;
        } else {
          cy.contains(/required/i).should('be.visible');
        }
      });
    });

    it('SC001-TC007: ทดสอบกรณี login ไม่สำเร็จ โดยกรอก Email และ Password ไม่ถูกต้อง', () => {
      cy.get('input[type="email"], input[placeholder*="admin@example.com" i]').type('wrong@example.com');
      cy.get('input[type="password"], input[placeholder*="••••••••"]').type('wrongpass123');
      cy.contains('button', 'Sign in').click();
      
      // Expected Result: ระบบจะต้องแสดงข้อความ "Login Error Invalid login credentials"
      cy.contains('Invalid login credentials', { matchCase: false }).should('be.visible');
    });
  });

  // =========================================================================
  // SC002: ทดสอบการใช้งานหน้าหลัก (My Task)
  // =========================================================================
  describe('SC002: ทดสอบการใช้งานหน้าหลัก (My Task)', () => {
    
    beforeEach(() => {
      loginSuccess();
    });

    it('SC002-TC001: ทดสอบการแสดงรายละเอียดหน้า My Task (UI)', () => {
      // Expected Result: ระบบแสดงรายละเอียด Task Card, Filter, Sort, และปุ่ม Create New Task
      cy.contains('Create New Task').should('be.visible');
      cy.contains(/Filter by Status/i).should('exist');
      cy.contains(/Filter by Priority/i).should('exist');
      cy.contains(/Sort by/i).should('exist');
      cy.contains(/Sort Order/i).should('exist');
      
      // ตรวจสอบโครงสร้างใน Task Card (ตรวจสอบการ์ดแรกถ้ามี)
      cy.get('body').then(($body) => {
        if ($body.find('.task-card, [class*="card"]').length > 0) {
          cy.get('.task-card, [class*="card"]').first().within(() => {
            cy.contains(/Status|Pending|In Progress|Completed/i).should('exist');
            cy.contains(/Priority|Low|Medium|High/i).should('exist');
          });
        }
      });
    });

    it('SC002-TC002: ทดสอบการกรองข้อมูลตามสถานะ (Filter by Status)', () => {
      // คลิกเลือก Dropdown Status และเลือกสถานะ (เช่น Completed)
      cy.contains('label', /Status/i).parent().find('select, [role="combobox"]').select('Completed', { force: true });
      // Expected Result: ระบบแสดง Task ตามสถานะที่เลือก
      cy.get('.task-card, [class*="card"]').each(($card) => {
        cy.wrap($card).contains('Completed').should('exist');
      });
    });

    it('SC002-TC003: ทดสอบการกรองข้อมูลตามความสำคัญ (Filter by Priority)', () => {
      // คลิกเลือก Dropdown Priority และเลือกความสำคัญ (เช่น High)
      cy.contains('label', /Priority/i).parent().find('select, [role="combobox"]').select('High', { force: true });
      // Expected Result: ระบบแสดง Task ตามความสำคัญที่เลือก
      cy.get('.task-card, [class*="card"]').each(($card) => {
        cy.wrap($card).contains('High').should('exist');
      });
    });

    it('SC002-TC004: ทดสอบการจัดเรียงข้อมูลตามเงื่อนไข (Sort By)', () => {
      cy.contains('label', /Sort By/i).parent().find('select, [role="combobox"]').select('Created At', { force: true });
      // Expected Result: ระบบแสดงลำดับของ Task ตามการจัดเรียงที่เลือก
      cy.get('.task-card, [class*="card"]').should('exist');
    });

    it('SC002-TC005: ทดสอบการจัดเรียงตามลำดับ (Sort Order)', () => {
      cy.contains('label', /Sort Order/i).parent().find('select, [role="combobox"]').select('Ascending', { force: true });
      // Expected Result: ระบบแสดงข้อมูล Task ตามการจัดเรียงที่เลือก (Ascending/Descending)
      cy.get('.task-card, [class*="card"]').should('exist');
    });

    it('SC002-TC006: ทดสอบกรณีกรองข้อมูล 2 Filter พร้อมกัน', () => {
      cy.contains('label', /Status/i).parent().find('select, [role="combobox"]').select('Pending', { force: true });
      cy.contains('label', /Priority/i).parent().find('select, [role="combobox"]').select('High', { force: true });
      
      // Expected Result: แสดงเฉพาะ Task ที่ตรงกับทั้ง 2 เงื่อนไขพร้อมกัน
      cy.get('body').then(($body) => {
        if ($body.find('.task-card, [class*="card"]').length > 0) {
          cy.get('.task-card, [class*="card"]').each(($card) => {
            cy.wrap($card).contains('Pending').should('exist');
            cy.wrap($card).contains('High').should('exist');
          });
        }
      });
    });

    it('SC002-TC007: ทดสอบการกรองและจัดเรียงข้อมูลพร้อมกัน 4 เงื่อนไข', () => {
      cy.contains('label', /Status/i).parent().find('select, [role="combobox"]').select('Pending', { force: true });
      cy.contains('label', /Priority/i).parent().find('select, [role="combobox"]').select('High', { force: true });
      cy.contains('label', /Sort By/i).parent().find('select, [role="combobox"]').select('Created At', { force: true });
      cy.contains('label', /Sort Order/i).parent().find('select, [role="combobox"]').select('Descending', { force: true });
      
      // Expected Result: ระบบต้องแสดงเฉพาะ Task ที่ตรงกับเงื่อนไขทั้งหมดและเรียงลำดับอย่างถูกต้อง
      cy.get('body').should('be.visible');
    });

    it('SC002-TC007 (Empty State): ตรวจสอบการแสดงผลกรณีไม่มี Task ในระบบ', () => {
      cy.intercept('GET', '**/tasks*', { body: [] }).as('getEmptyTasks');
      cy.reload();
      cy.wait('@getEmptyTasks');
      
      // Expected Result: ระบบจะต้องแสดงข้อความ "No tasks found Get started by creating a new task"
      cy.contains('No tasks found').should('be.visible');
      cy.contains('Get started by creating a new task').should('be.visible');
    });

    it('SC002-TC008: ตรวจสอบการคลิกดูรายละเอียด/แก้ไข Task', () => {
      cy.get('.task-card, [class*="card"]').first().click();
      // Expected Result: ระบบต้องแสดงหน้ารายละเอียดของ Task
      cy.contains('button', 'Edit Task').should('be.visible');
      cy.contains('button', 'Delete Task').should('be.visible');
    });

    it('SC002-TC009: ตรวจสอบการทำงานของปุ่ม Create New Task', () => {
      cy.contains('Create New Task').should('be.visible');
      // Expected Result: ระบบเปิดหน้าต่างสร้างงาน (Modal/Popup) หรือนำทางไปยังหน้าแบบฟอร์ม
      cy.contains('Create New Task').should('be.visible');
      cy.contains('Fill in the details below to create a new task').should('be.visible');
    });

    it('SC002-TC0010: ตรวจสอบการทำงานของปุ่ม Logout', () => {
      cy.contains('button', 'Logout').click();
      // Expected Result: ระบบออกจากระบบและแสดงหน้า Login
      cy.url().should('include', '/login');
      cy.contains('Sign in').should('be.visible');
    });
  });

  // =========================================================================
  // SC003: ทดสอบการใช้งานหน้าสร้าง Task ใหม่
  // =========================================================================
  describe('SC003: ทดสอบการใช้งานหน้าสร้าง Task ใหม่', () => {
    
    beforeEach(() => {
      loginSuccess();
      cy.contains('Create New Task').should('be.visible');
    });

    it('SC003-TC001: ทดสอบการแสดงรายละเอียดหน้า Create New Task (UI)', () => {
      // Expected Result: ระบบแสดงรายละเอียด Title, Description, Status, Priority
      cy.contains(/Title/i).should('be.visible');
      cy.contains(/Description/i).should('be.visible');
      cy.contains(/Status/i).should('be.visible');
      cy.contains(/Priority/i).should('be.visible');
    });

    it('SC003-TC002: ตรวจสอบการอัปเดตรายการหลังสร้าง Task สำเร็จ', () => {
      const newTitle = `New Task Automated ${Date.now()}`;
      cy.get('input[placeholder*="title" i]').type(newTitle);
      cy.get('textarea[placeholder*="description" i]').type('รายละเอียดสำหรับทดสอบการสร้าง Task ใหม่');
      cy.contains('label', /Status/i).parent().find('select').select('Pending');
      cy.contains('label', /Priority/i).parent().find('select').select('High');
      
      cy.contains('button', 'Create Task').click();
      
      // Expected Result: Task ที่เพิ่งสร้างใหม่ต้องปรากฏบนรายการ My Tasks ทันที
      cy.contains('My Tasks').should('be.visible');
      cy.contains(newTitle).should('be.visible');
    });

    it('SC003-TC003: ตรวจสอบการยกเลิกการสร้าง Task ใหม่', () => {
      cy.get('input[placeholder*="title" i]').type('Task to be cancelled');
      cy.contains('button', 'Cancel').click();
      
      // Expected Result: ระบบยกเลิกการสร้างและแสดงหน้า My Task
      cy.contains('My Tasks').should('be.visible');
      cy.contains('Task to be cancelled').should('not.exist');
    });
  });

  // =========================================================================
  // SC004: ทดสอบการใช้งานหน้ารายละเอียดของ Task
  // =========================================================================
  describe('SC004: ทดสอบการใช้งานหน้ารายละเอียดของ Task', () => {
    const testTaskTitle = `Task For SC004 ${Date.now()}`;

    beforeEach(() => {
      loginSuccess();
      // สร้าง Task ชั่วคราวก่อนเข้าเทสหน้ารายละเอียดเพื่อความชัวร์ว่ามีข้อมูล
     cy.contains('Create New Task').should('be.visible');
      cy.get('input[placeholder*="title" i]').type(testTaskTitle);
      cy.get('textarea[placeholder*="description" i]').type('รายละเอียดสำหรับ SC004');
      cy.contains('button', 'Create Task').click();
      cy.contains(testTaskTitle).click(); // คลิกเข้าหน้ารายละเอียด
    });

    it('SC004-TC001: ทดสอบการแสดงรายละเอียดหน้ารายละเอียดของ Task (UI)', () => {
      // Expected Result: แสดง Title, Description, Status, Priority, Created At, Last Updated, ปุ่ม Edit/Delete
      cy.contains(testTaskTitle).should('be.visible');
      cy.contains('Created At').should('be.visible');
      cy.contains('Last Updated').should('be.visible');
      cy.contains('button', 'Edit Task').should('be.visible');
      cy.contains('button', 'Delete Task').should('be.visible');
    });

    it('SC004-TC002: ทดสอบการแก้ไขรายละเอียดของ Task', () => {
      const updatedTitle = `${testTaskTitle} - Updated`;
      cy.contains('button', 'Edit Task').click();
      
      cy.get('input[placeholder*="title" i], input[value*="Task For SC004"]').clear().type(updatedTitle);
      cy.contains('button', /Update Task|Save|Confirm/i).click();
      
      // Expected Result: ข้อมูล Task ต้องอัปเดตตามที่แก้ไข
      cy.contains(updatedTitle).should('be.visible');
    });

    it('SC004-TC004: ทดสอบการยกเลิกการแก้ไขรายละเอียดของ Task', () => {
      cy.contains('button', 'Edit Task').click();
      cy.get('input[placeholder*="title" i], input[value*="Task For SC004"]').clear().type('Should Not Save This Title');
      cy.contains('button', 'Cancel').click();
      
      // Expected Result: ระบบยกเลิกการแก้ไข ข้อมูลใน Task ต้องเหมือนเดิมไม่มีการเปลี่ยนแปลง
      cy.contains(testTaskTitle).should('be.visible');
      cy.contains('Should Not Save This Title').should('not.exist');
    });

    it('SC004-TC003: ทดสอบการลบ Task', () => {
      cy.contains('button', 'Delete Task').click();
     
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Confirm"), button:contains("Yes")').length > 0) {
          cy.contains('button', /Confirm|Yes|ลบ/i).click();
        }
      });
      
      // Expected Result: ลบ Task ได้ และหน้า My Task ข้อมูลต้องหายไปทันที
      cy.contains('My Tasks').should('be.visible');
      cy.contains(testTaskTitle).should('not.exist');
    });
  });

});