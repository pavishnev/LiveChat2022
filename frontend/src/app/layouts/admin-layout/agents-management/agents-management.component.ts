import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentsTableElement } from 'src/app/interfaces/agents-table-element.interface';
import { AgentsAuthService } from 'src/app/services/agents-auth.service';

// const ELEMENT_DATA: AgentsTableElement[] = [
//   {id: 'dfsdf', name: 'agent1', email: "agent1@yopmail.com", status: "active"},
//  {id: 'dfsd543f', name: 'agent2',  email: "agent2@yopmail.com", status: "active"},
//   {id: 'dfsccdf', name: 'agent3', email: "agent3@yopmail.com", status: "waiting for approval"},
//    {id: 'dfxxsdf', name: 'agent4', email: "agent4@yopmail.com", status: "active"},
//     {id: 'dfxfdfxsdf', name: 'agent5', email: "agent5@yopmail.com", status: "active"},
//      {id: 'dfxxsfdff', name: 'agent6', email: "agent6@yopmail.com", status: "active"},
// ]


@Component({
  selector: 'app-agents-management',
  templateUrl: './agents-management.component.html',
  styleUrls: ['./agents-management.component.css']
})
export class AgentsManagementComponent implements OnInit,AfterViewInit {

 tableContent: AgentsTableElement[]=[];
 dataSource = new MatTableDataSource<AgentsTableElement>(this.tableContent);
  constructor(private route: ActivatedRoute,
               private router: Router,
               private agentsAuthService:AgentsAuthService   ) { }
 

 ngOnInit() {
    this.agentsAuthService.getAllAgents().subscribe(agentsItems=>{      
       this.tableContent = agentsItems;
       this.dataSource = new MatTableDataSource<AgentsTableElement>(this.tableContent);
        this.dataSource.paginator = this.paginator;
    })

  }
  displayedColumns: string[] = [ 'name', 'email', 'status'];


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
