package com.vti.AccountService.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.vti.AccountService.dto.DepartmentDto;
import com.vti.AccountService.dto.PositionDto;
import com.vti.AccountService.entity.Account;
import com.vti.AccountService.entity.Department;
import com.vti.AccountService.entity.Position;
import com.vti.AccountService.feignclient.IDepartmentFeignClient;
import com.vti.AccountService.feignclient.IPositionFeignClient;
import com.vti.AccountService.form.CreateAccountForm;
import com.vti.AccountService.repository.IAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final IAccountRepository accountRepository;
    private final IDepartmentFeignClient departmentFeignClient;
    private final IPositionFeignClient positionFeignClient;

    public List<Account> getAllAccount() {
        return accountRepository.findAll();
    }

    public Account getAccountById(short id) {
        return accountRepository.findById(id).orElse(null);
    }

    public void deleteAccount(short id) {
        accountRepository.deleteById(id);
    }

    public Account createAccount(CreateAccountForm form) {
        Account account = new Account();

        short departmentId = form.getDepartmentId();
        short positionId = form.getPositionId();

        DepartmentDto departmentResponse = departmentFeignClient.getDepartmentByID(departmentId)
                .getBody();
        Department department = new Department();
        department.setId(departmentResponse.getId());
        department.setName(departmentResponse.getName());

        PositionDto positionResponse = positionFeignClient.getPositionByID(positionId).getBody();
        Position position = new Position();
        position.setId(positionResponse.getId());
        position.setName(positionResponse.getName());

        account.setEmail(form.getEmail());
        account.setUsername(form.getUsername());
        account.setFullname(form.getFullname());
        account.setDepartment(department);
        account.setPosition(position);

        Account savedAccount = accountRepository.save(account);

        return savedAccount;
    }

}
