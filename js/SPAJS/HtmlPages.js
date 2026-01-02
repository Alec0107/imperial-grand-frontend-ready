export const AuthPages = {
    signup:     `
        <section class="register-container">
            <img class="logo-image" src="../../img/logo.png"/> <!--Logo-->
            
            <h2 class="heading">Sign up to Imperial Grand</h2> <!--heading-->
            
            <!-- Registration Form -->
            <form class="auth-form" id="signup-form">
                
                <!-- Name -->
                <div class="form-group">
                <label for="name">Name*</label>
                <input class="input"
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Name"
                    required>
                 <div class="error-div"></div>   
                </div>

                <!-- Phone -->
                <div class="form-group phone-group">
                 <label for="number">Phone number*</label>
                <input class="input"
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required>
                <div class="error-div"></div>       
                </div>

                <!-- Email -->
                <div class="form-group">
                <label for="email">Email address*</label>
                <input class="input"
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Email"
                    required>
                <div class="error-div"></div>       
                </div>

                <!-- Password -->
                <div class="form-group password-container">
                <label for="password">Password*</label>
                <input class="input"
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Password"
                    required>
                <img class="toggle-password" id="togglePassword" src="../../icons/hide.png" />   
                <div class="error-div"></div>   
                </div>

                <!-- Error Div -->
                <div class="error-div-server">
                    <div></div>
                    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 2H8L2 8V16L8 22H16L22 16V8L16 2Z" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 8V12" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 16.0195V16" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    <p id="serverErrMessage"></p>
                </div>

                <!-- Submit -->
                <button type="submit" class="btn-submit" id="signupBtn">Create Account</button>
            </form>

            <p class="terms-privacy-p">By creating an account, you agree to our
                <a href="/pages/privacy_policy/terms-of-services.html" class="terms-of-service-link">Terms of Service.</a>
                  and
                <a href="/pages/privacy_policy/privacy-policy.html" class="privacy-link">Privacy Policy</a>.
            </p>


            <div class="login-div">
              <p>Already have an account? 
                <a href="#login" class="login-link">Log in</a>.
              </p>
            </div>

        </section>

    `,
    otp: `
        <section class="OTP-container">
            
            <div class="heading">
                <h1>OTP Verification</h1>
                <p>Please enter the OTP (One-Time Password) sent to your registered email to complete your verification.</p>
            </div>

            <form class="otp-main-form" id="otp-form">

           
                <div class="otp-input-container">
                    <input type="text" class="otp-input" maxlength="1" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
                    <input type="text" class="otp-input" maxlength="1" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
                    <input type="text" class="otp-input" maxlength="1" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
                    <input type="text" class="otp-input" maxlength="1" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
                    <input type="text" class="otp-input" maxlength="1" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
                    <input type="text" class="otp-input" maxlength="1" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
                </div>
                <!-- INPUTS -->

                <!-- Error Div -->
                <div class="error-div-server">
                    <div></div>
                    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 2H8L2 8V16L8 22H16L22 16V8L16 2Z" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 8V12" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 16.0195V16" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    <p id="serverErrMessage"></p>
                </div>


                <!-- RESEND AND BUTTONS -->
                <div class="resend-button-div">
                    <p>Didn’t receive the OTP? <span id="resend-otp-btn">Resend</span></p>

                    <button type="submit" class="btn-submit" id="verifyOtpBtn">Verify</button>
                    <button type="button" class="btn-submit btn-cancel" id="cancelOtpVerifBtn">Cancel</button>

                </div>


            </form>

        </section>

    `,
    emailVerified: `
        <section class="email-verified-container">

             <svg class="check-svg" width="10px" height="10px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#23a121"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="#23a121" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#23a121" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
            
             <div>
                <h1 class="verified!">Verified!</h1> <!--heading-->
                <p>Your email has been verified.</p>
             </div>

             <button type="button" class="btn-submit btn-login" id="loginBtn">Sign in</button>
        </section>
    `,
    login: `
    <section class="register-container">
            <img class="logo-image" src="../../img/logo.png"/> <!--Logo-->
            
            <h2 class="heading">Sign in to Imperial Grand</h2> <!--heading-->
            
            <!-- Login Form -->
            <form class="auth-form" id="login-form">
                
                <!-- Email -->
                <div class="form-group">
                <label for="email">Email address*</label>
                <input class="input"
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Email"
                    required>
                <div class="error-div"></div>       
                </div>

                <!-- Password -->
                <div class="form-group password-container">
                <label for="password">Password*</label>
                <input class="input"
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Password"
                    required>
                <img class="toggle-password" id="togglePassword" src="../../icons/hide.png" />   
                <div class="error-div"></div>   
                </div>

                <!-- Error Div -->
                <div class="error-div-server">
                    <div></div>
                    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 2H8L2 8V16L8 22H16L22 16V8L16 2Z" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 8V12" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 16.0195V16" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    <p id="serverErrMessage"></p>
                </div>

                <!-- Submit -->
                <button type="submit" class="btn-submit" id="loginBtn">Sign in</button>
            </form>


            <div class="login-div">
              <p>New to Imperial Grand? 
                <a href="#signup" class="login-link">Create an account.</a>.
              </p>
            </div>

        </section>
    `,
    dashboard: `
    <section class="user-dashboard">

        <div>

            <div class="profile-div">
                <div class="img-profile"></div>
                <h1>Nicholas Poquita</h1>
                <h2>melrich.npl@gmail.com</h1>
            </div>
            

            <ul class="sidebar-menu">

                <li class="active" data-page="account">   
                    <svg width="10px" height="10px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=fill"> <g id="profile"> <path id="vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M6.75 6.5C6.75 3.6005 9.1005 1.25 12 1.25C14.8995 1.25 17.25 3.6005 17.25 6.5C17.25 9.3995 14.8995 11.75 12 11.75C9.1005 11.75 6.75 9.3995 6.75 6.5Z" fill="#cecece"></path> <path id="rec (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M4.25 18.5714C4.25 15.6325 6.63249 13.25 9.57143 13.25H14.4286C17.3675 13.25 19.75 15.6325 19.75 18.5714C19.75 20.8792 17.8792 22.75 15.5714 22.75H8.42857C6.12081 22.75 4.25 20.8792 4.25 18.5714Z" fill="#cecece"></path> </g> </g> </g></svg>
                    <span class="font-nav active">My Account</span>
                </li>
                <li data-page="reservations">
                   <svg width="160px" height="160px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="dashboardIconTitle" stroke="#cecece" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title id="dashboardIconTitle">Dashboard</title> <rect width="20" height="20" x="2" y="2"></rect> <path d="M11 7L17 7M11 12L17 12M11 17L17 17"></path> <line x1="7" y1="7" x2="7" y2="7"></line> <line x1="7" y1="12" x2="7" y2="12"></line> <line x1="7" y1="17" x2="7" y2="17"></line> </g></svg>
                   <span class="font-nav">My Reservations</span>
                </li>
                <li data-page="rewards">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" width="64px" height="64px" fill="#a1a1a1" stroke="#a1a1a1"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polyline style="fill:none;stroke:#a1a1a1;stroke-width:0.8320000000000001;stroke-miterlimit:10;" points="26,14 26,27 6,27 6,14 "></polyline> <rect x="5" y="10" style="fill:none;stroke:#a1a1a1;stroke-width:0.8320000000000001;stroke-miterlimit:10;" width="22" height="4"></rect> <path style="fill:none;stroke:#a1a1a1;stroke-width:0.8320000000000001;stroke-miterlimit:10;" d="M16,10c0,0,2.895,0,4,0s2-0.895,2-2s-0.895-2-2-2 C17.625,6,16,10,16,10z"></path> <path style="fill:none;stroke:#a1a1a1;stroke-width:0.8320000000000001;stroke-miterlimit:10;" d="M16,10c0,0-2.895,0-4,0s-2-0.895-2-2s0.895-2,2-2 C14.375,6,16,10,16,10z"></path> <line style="fill:none;stroke:#a1a1a1;stroke-width:0.8320000000000001;stroke-miterlimit:10;" x1="16" y1="27" x2="16" y2="16"></line> <line style="fill:none;stroke:#a1a1a1;stroke-width:0.8320000000000001;stroke-miterlimit:10;" x1="16" y1="14" x2="16" y2="12"></line> </g></svg>
                    <span class="font-nav">Rewards/Vouchers</span>    
                </li>
                <li data-page="rewards">
                    <span class="font-nav"></span>    
                </li>
                <li data-page="rewards">
                    <span style="color:red;" class="font-nav">Logout</span>    
                </li>
            </ul>
        </div>




        <div class="content">

         

        </div>

        <!-- Backdrop -->
        <div id="cancel-backdrop" class="cancel-backdrop hidden"></div>

        <!-- Modal -->
        <div id="cancel-modal" class="cancel-modal hidden">
        <div class="modal-content">
            <h3 >Cancel Reservation?</h3>
            <p>Are you sure you want to cancel this reservation?</p>

            <div class="modal-buttons">
            <button id="confirm-cancel" class="confirm-btn">Yes, Cancel</button>
            <button id="close-modal" class="close-btn">No, Keep It</button>
            </div>
        </div>
        </div>



        <div id="detailsModal" class="modal-overlay hidden">
        <div class="modal-box">
            <h2>Reservation Details</h2>

            <div class="info-row">
            <span class="icon">📅</span>
            <span id="detailDate"></span>
            </div>

            <div class="info-row">
            <span class="icon">⏰</span>
            <span id="detailTime"></span>
            </div>

            <div class="info-row">
            <span class="icon">👥</span>
            <span id="detailGuests"></span>
            </div>

            <div class="info-row">
            <span class="icon">🪑</span>
            <span id="detailTable"></span>
            </div>

            <hr>

            <div class="two-col">
            <div>
                <h4 class="font-view-details">Occasions</h4>
                <div id="detailOccasions" class="tag-box"></div>
            </div>
            <div>
                <h4 class="font-view-details">Dietary Restrictions</h4>
                <div id="detailDietary" class="tag-box"></div>
            </div>
            </div>

            <h4 class="font-view-details">Special Requests</h4>
            <p id="detailNotes" class="note-text font-view-details">None</p>

            <div class="modal-actions">
            <button id="closeDetailsBtn" class="btn-secondary">Close</button>
            <button class="btn-primary">Cancel Reservation</button>
            </div>
        </div>
        </div>

        

    </section>
    `
}


export const userDashboard = {
    reservations:
    `   
        <div class="header"> 
  
            <div>
                <div class="buttons-res">
                    <button id="upcoming-res" class="upcoming-btn active">Upcoming</button>
                    <button id="past-res" class="past-btn">Past</button>
                </div>
            
                <div class="pagination-btn">
                    <p class="sub"><</p>
                     <p class="add">></p>
                </div>
            </div>
        </div>
        
        <div class="reservation-container">

        </div>

        
    `
    , 
    rewards: `
    
    `,
    myAccount: `
    <div class="acc-shell">
        <div class="acc-card">
            <h2 class="acc-h2">My Account</h2>

            <div class="acc-grid">
            <div class="acc-label">Name</div>
            <div id="accName" class="acc-value">—</div>

            <div class="acc-label">Email</div>
            <div id="accEmail" class="acc-value">—</div>

            <div class="acc-label">Phone</div>
            <div id="accPhone" class="acc-value">—</div>

            <div class="acc-divider" aria-hidden="true"></div>
            <div class="acc-divider" aria-hidden="true"></div>

            <div class="acc-label">Birthday</div>
            <div>
                <input type="date" id="accBirthday" class="acc-input" />
                <div class="acc-hint">Add your birthday to unlock rewards.</div>
            </div>
            </div>

            <button id="saveAccountBtn" class="acc-btn">Save Changes</button>
            <p id="accountMessage" class="acc-msg" aria-live="polite"></p>
        </div>
    </div>
`
}

// adminDashboard.js (or wherever you keep view templates)
export const adminDashboard = {
  customers: `
        <section class="customers-section">
        <h1 class="title">Customers</h1>

        <div class="customer-table-card">
            <table class="customer-table" aria-label="Customers table">
            <thead>
                <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody id="customer-table-body">
                <!-- rows go here via JS -->
            </tbody>
            </table>

            <div class="pagination" aria-label="Pagination">
            <button id="prevPage" class="page-btn" aria-label="Previous page">&lt;</button>
            <span id="pageIndicator" aria-live="polite">1</span>
            <button id="nextPage" class="page-btn" aria-label="Next page">&gt;</button>
            </div>
        </div>
        </section>
  `,
  reservations: `
    <div class="reservations-page">
        <div class="res-header">
        <h1>Reservations</h1>
        <div class="actions">
            <button id="btn-walkin">+ Walk-in</button>
            <button id="btn-add-res">+ Reservation</button>
        </div>
        </div>

        <div class="res-tabs">
        <button class="tab active" data-tab="upcoming">Upcoming</button>
        <button class="tab" data-tab="checkedin">Checked In</button>
        <button class="tab" data-tab="noshow">No-show</button>
        <button class="tab" data-tab="past">Past</button>
        </div>

        <div id="res-list" class="res-list">
        <!-- dynamically filled by JS -->
        </div>
    </div>

    <!-- Reservation Drawer -->
    <div id="res-overlay" class="cust-overlay" style="display:none" data-close="1"></div>
    <aside id="res-drawer" class="cust-drawer" style="display:none">
        <header class="cust-drawer__header">
        <h2 class="cust-title">Reservation • <span id="res-id">—</span></h2>
        <button class="cust-x" data-close="1" aria-label="Close">✕</button>
        </header>
        <section class="cust-drawer__body" id="res-detail-body">
        <!-- details loaded dynamically -->
        </section>
    </aside>
    `,
    menuItems: `
    <section class="customers-section">
      <h1 class="title">Menu Items</h1>

      <div class="customer-table-card">
        <div style="display:flex;justify-content:flex-end;margin-bottom:8px;">
          <button id="btn-add-menu" class="page-btn">+ Add Item</button>
        </div>

        <table class="customer-table" aria-label="Menu items">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Subcategory</th>
              <th scope="col">Price</th>
              <th scope="col">Active</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody id="menu-table-body">
            <!-- rows go here -->
          </tbody>
        </table>

        <div class="pagination" aria-label="Pagination">
          <button id="mi-prev" class="page-btn" aria-label="Previous page">&lt;</button>
          <span id="mi-page" aria-live="polite">1</span>
          <button id="mi-next" class="page-btn" aria-label="Next page">&gt;</button>
        </div>
      </div>
    </section>
  `,
  // …existing pages
  categories: `
<section class="customers-section">
  <h1 class="title">Categories & Subcategories</h1>

  <div class="grid-two" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <!-- Left: Categories -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h2 style="margin:0;">Categories</h2>
        <button id="btn-add-category" class="page-btn">+ Add Category</button>
      </div>

      <table class="customer-table" aria-label="Categories">
        <thead>
          <tr>
            <th style="width:80px;">ID</th>
            <th>Name</th>
            <th style="width:140px;">Display Order</th>
            <th style="width:180px;">Actions</th>
          </tr>
        </thead>
        <tbody id="cat-table-body"></tbody>
      </table>
    </div>

    <!-- Right: Subcategories -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h2 style="margin:0;">Subcategories</h2>
        <button id="btn-add-subcat" class="page-btn" disabled>+ Add Subcategory</button>
      </div>

      <div id="subcat-empty-hint" style="font-size:14px;opacity:.8;">
        Select a category on the left to view its subcategories.
      </div>

      <table class="customer-table" aria-label="Subcategories" style="display:none;" id="subcat-table">
        <thead>
          <tr>
            <th style="width:80px;">ID</th>
            <th>Name</th>
            <th style="width:140px;">Display Order</th>
            <th style="width:180px;">Actions</th>
          </tr>
        </thead>
        <tbody id="subcat-table-body"></tbody>
      </table>
    </div>
  </div>
</section>
  `,
  setMenus: `
    <section class="customers-section">
      <h1 class="title">Set Menus</h1>

      <div class="customer-table-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-size:14px;opacity:.8;">
            Manage fixed-price set meals and their dishes.
          </div>
          <button id="btn-add-setmenu" class="page-btn">+ Add Set Menu</button>
        </div>

        <table class="customer-table" aria-label="Set menus">
          <thead>
            <tr>
              <th style="width:60px;">ID</th>
              <th>Name</th>
              <th style="width:120px;">Price</th>
              <th style="width:120px;">Active</th>
              <th style="width:120px;">Order</th>
              <th style="width:140px;">Actions</th>
            </tr>
          </thead>
          <tbody id="setmenu-table-body">
            <!-- rows injected by JS -->
          </tbody>
        </table>

        <div class="pagination" aria-label="Pagination">
          <button id="sm-prev" class="page-btn" aria-label="Previous page">&lt;</button>
          <span id="sm-page">1</span>
          <button id="sm-next" class="page-btn" aria-label="Next page">&gt;</button>
        </div>
      </div>
    </section>
  `
};
